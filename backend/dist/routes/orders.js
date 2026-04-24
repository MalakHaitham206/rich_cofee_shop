import supabase from '../lib/supabase.js';
import { z } from 'zod';
import { authenticate } from '../middleware/auth.js';
const orderItemSchema = z.object({
    product_id: z.string().uuid(),
    quantity: z.number().int().positive(),
});
const createOrderSchema = z.object({
    items: z.array(orderItemSchema).min(1),
});
export default async function orderRoutes(fastify) {
    // Apply the authentication middleware to all routes in this file
    fastify.addHook('preHandler', authenticate);
    fastify.post('/', async (request, reply) => {
        try {
            const { items } = createOrderSchema.parse(request.body);
            const userId = request.user.id;
            // 1. Fetch product prices to calculate the total
            const productIds = items.map((item) => item.product_id);
            const { data: products, error: productsError } = await supabase
                .from('products')
                .select('id, price, is_active')
                .in('id', productIds);
            if (productsError)
                throw productsError;
            if (!products || products.length !== productIds.length) {
                return reply.status(400).send({ message: 'One or more products are invalid or unavailable' });
            }
            // Check if all products are active
            if (products.some((p) => !p.is_active)) {
                return reply.status(400).send({ message: 'One or more products are currently inactive' });
            }
            // 2. Calculate total amount
            let totalAmount = 0;
            const orderItemsToInsert = items.map((item) => {
                const product = products.find((p) => p.id === item.product_id);
                totalAmount += product.price * item.quantity;
                return {
                    product_id: item.product_id,
                    quantity: item.quantity,
                    unit_price: product.price,
                };
            });
            // 3. Insert order
            const { data: orderData, error: orderError } = await supabase
                .from('orders')
                .insert([{ user_id: userId, total_amount: totalAmount, status: 'pending' }])
                .select('id')
                .single();
            if (orderError)
                throw orderError;
            // 4. Insert order items
            const itemsWithOrderId = orderItemsToInsert.map((item) => ({
                ...item,
                order_id: orderData.id,
            }));
            const { error: itemsError } = await supabase.from('order_items').insert(itemsWithOrderId);
            if (itemsError)
                throw itemsError;
            return reply.status(201).send({ message: 'Order placed successfully', order_id: orderData.id });
        }
        catch (error) {
            if (error instanceof z.ZodError) {
                return reply.status(400).send({ message: 'Validation error', errors: error.errors });
            }
            fastify.log.error(error);
            return reply.status(500).send({ message: 'Internal Server Error' });
        }
    });
    fastify.get('/', async (request, reply) => {
        try {
            const userId = request.user.id;
            const { data, error } = await supabase
                .from('orders')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false });
            if (error)
                throw error;
            return reply.send(data);
        }
        catch (error) {
            fastify.log.error(error);
            return reply.status(500).send({ message: 'Internal Server Error' });
        }
    });
    fastify.get('/:id', async (request, reply) => {
        try {
            const { id } = z.object({ id: z.string().uuid() }).parse(request.params);
            const userId = request.user.id;
            // Fetch order details
            const { data: order, error: orderError } = await supabase
                .from('orders')
                .select('*')
                .eq('id', id)
                .eq('user_id', userId)
                .single();
            if (orderError || !order) {
                return reply.status(404).send({ message: 'Order not found' });
            }
            // Fetch order items with product details
            const { data: items, error: itemsError } = await supabase
                .from('order_items')
                .select(`
          id, quantity, unit_price,
          products (id, name, image_url)
        `)
                .eq('order_id', id);
            if (itemsError)
                throw itemsError;
            return reply.send({ order, items });
        }
        catch (error) {
            if (error instanceof z.ZodError) {
                return reply.status(400).send({ message: 'Invalid order ID' });
            }
            fastify.log.error(error);
            return reply.status(500).send({ message: 'Internal Server Error' });
        }
    });
}
//# sourceMappingURL=orders.js.map