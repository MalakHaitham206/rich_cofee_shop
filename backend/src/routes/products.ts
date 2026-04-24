import type { FastifyInstance } from 'fastify';
import supabase from '../lib/supabase.js';
import { z } from 'zod';

const productsQuerySchema = z.object({
  category_id: z.uuid().optional(),
  search: z.string().optional(),
});

export default async function productRoutes(fastify: FastifyInstance) {
  // GET /products — list all active products (with optional filter & search)
  fastify.get('/', async (request, reply) => {
    try {
      const { category_id, search } = productsQuerySchema.parse(request.query);

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

      if (search) {
        query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
      }

      const { data, error } = await query.order('name', { ascending: true });

      if (error) {
        return reply.status(500).send({ message: error.message });
      }

      return reply.send(data);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({ message: 'Validation error', errors: (error as any).errors });
      }
      fastify.log.error(error);
      return reply.status(500).send({ message: 'Internal Server Error' });
    }
  });

  // GET /products/:id — get a single active product by ID
  fastify.get('/:id', async (request, reply) => {
    try {
      const { id } = z.object({ id: z.uuid() }).parse(request.params);

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
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({ message: 'Invalid product ID' });
      }
      fastify.log.error(error);
      return reply.status(500).send({ message: 'Internal Server Error' });
    }
  });
}
