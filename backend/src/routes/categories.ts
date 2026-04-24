import type { FastifyInstance } from 'fastify';
import supabase from '../lib/supabase.js';

export default async function categoryRoutes(fastify: FastifyInstance) {
  fastify.get('/', async (request, reply) => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name', { ascending: true });

      if (error) {
        return reply.status(500).send({ message: error.message });
      }

      return reply.send(data);
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ message: 'Internal Server Error' });
    }
  });
}
