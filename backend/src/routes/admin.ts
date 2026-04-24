import type { FastifyInstance } from 'fastify';
import supabase from '../lib/supabase.js';
import { z } from 'zod';
import { requireAdmin } from '../middleware/auth.js';

const updateOrderStatusSchema = z.object({
  status: z.enum(['pending', 'processing', 'completed', 'cancelled']),
});

const createProductSchema = z.object({
  name: z.string().min(3),
  description: z.string().optional(),
  price: z.number().positive(),
  image_url: z.url().optional(),
  category_id: z.uuid(),
});
const updateProductSchema = createProductSchema.partial();

export default async function adminRoutes(fastify: FastifyInstance) {
  fastify.addHook('preHandler', requireAdmin);

  // --- ORDERS ---

  fastify.get('/orders', async (request, reply) => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          profiles (id, name, email)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return reply.send(data);
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ message: 'Internal Server Error' });
    }
  });

  fastify.patch('/orders/:id', async (request, reply) => {
    try {
      const { id } = z.object({ id: z.string().uuid() }).parse(request.params);
      const { status } = updateOrderStatusSchema.parse(request.body);

      const { data, error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        return reply.status(400).send({ message: error.message });
      }

      return reply.send({ message: 'Order status updated', order: data });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({ message: 'Validation error', errors: (error as any).errors });
      }
      fastify.log.error(error);
      return reply.status(500).send({ message: 'Internal Server Error' });
    }
  });

  // --- PRODUCTS ---

  // GET /admin/products — list ALL products (including inactive) for admin dashboard
  fastify.get('/products', async (request, reply) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          id, name, description, price, image_url, is_active,
          categories (id, name, slug)
        `)
        .order('name', { ascending: true });

      if (error) throw error;

      return reply.send(data);
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ message: 'Internal Server Error' });
    }
  });

  fastify.post('/products', async (request, reply) => {
    try {
      const productData = createProductSchema.parse(request.body);

      const { data, error } = await supabase
        .from('products')
        .insert([productData])
        .select()
        .single();

      if (error) {
        return reply.status(400).send({ message: error.message });
      }

      return reply.status(201).send({ message: 'Product created successfully', product: data });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({ message: 'Validation error', errors: (error as any).errors });
      }
      fastify.log.error(error);
      return reply.status(500).send({ message: 'Internal Server Error' });
    }
  });

  fastify.patch('/products/:id', async (request, reply) => {
    try {
      const { id } = z.object({ id: z.string().uuid() }).parse(request.params);
      const updates = updateProductSchema.parse(request.body);

      const { data, error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        return reply.status(400).send({ message: error.message });
      }

      return reply.send({ message: 'Product updated successfully', product: data });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({ message: 'Validation error', errors: (error as any).errors });
      }
      fastify.log.error(error);
      return reply.status(500).send({ message: 'Internal Server Error' });
    }
  });

  fastify.patch('/products/:id/toggle', async (request, reply) => {
    try {
      const { id } = z.object({ id: z.string().uuid() }).parse(request.params);

      // First, get the current status
      const { data: currentProduct, error: fetchError } = await supabase
        .from('products')
        .select('is_active')
        .eq('id', id)
        .single();

      if (fetchError || !currentProduct) {
        return reply.status(404).send({ message: 'Product not found' });
      }

      // Toggle it
      const { data, error: updateError } = await supabase
        .from('products')
        .update({ is_active: !currentProduct.is_active })
        .eq('id', id)
        .select()
        .single();

      if (updateError) {
        return reply.status(400).send({ message: updateError.message });
      }

      return reply.send({
        message: `Product ${data.is_active ? 'activated' : 'deactivated'} successfully`,
        is_active: data.is_active,
      });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({ message: 'Invalid product ID' });
      }
      fastify.log.error(error);
      return reply.status(500).send({ message: 'Internal Server Error' });
    }
  });

  // DELETE /admin/products/:id — permanently delete a product
  fastify.delete('/products/:id', async (request, reply) => {
    try {
      const { id } = z.object({ id: z.uuid() }).parse(request.params);

      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) {
        return reply.status(400).send({ message: error.message });
      }

      return reply.send({ message: 'Product deleted successfully' });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({ message: 'Invalid product ID' });
      }
      fastify.log.error(error);
      return reply.status(500).send({ message: 'Internal Server Error' });
    }
  });
}
