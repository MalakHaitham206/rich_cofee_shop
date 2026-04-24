import supabase from '../lib/supabase.js';
import { z } from 'zod';
const productsQuerySchema = z.object({
    category_id: z.string().uuid().optional(),
});
export default async function productRoutes(fastify) {
    fastify.get('/', async (request, reply) => {
        try {
            const { category_id } = productsQuerySchema.parse(request.query);
            let query = supabase
                .from('products')
                .select(`
          id, name, description, price, image_url, is_active,
          categories (id, name, slug)
        `)
                .eq('is_active', true);
            if (category_id) {
                query = query.eq('category_id', category_id);
            }
            const { data, error } = await query.order('name', { ascending: true });
            if (error) {
                return reply.status(500).send({ message: error.message });
            }
            return reply.send(data);
        }
        catch (error) {
            if (error instanceof z.ZodError) {
                return reply.status(400).send({ message: 'Validation error', errors: error.errors });
            }
            fastify.log.error(error);
            return reply.status(500).send({ message: 'Internal Server Error' });
        }
    });
    fastify.get('/:id', async (request, reply) => {
        try {
            const { id } = z.object({ id: z.string().uuid() }).parse(request.params);
            const { data, error } = await supabase
                .from('products')
                .select(`
          id, name, description, price, image_url, is_active,
          categories (id, name, slug)
        `)
                .eq('id', id)
                .eq('is_active', true)
                .single();
            if (error || !data) {
                return reply.status(404).send({ message: 'Product not found' });
            }
            return reply.send(data);
        }
        catch (error) {
            if (error instanceof z.ZodError) {
                return reply.status(400).send({ message: 'Invalid product ID' });
            }
            fastify.log.error(error);
            return reply.status(500).send({ message: 'Internal Server Error' });
        }
    });
}
//# sourceMappingURL=products.js.map