import type { FastifyRequest, FastifyReply } from 'fastify';
import '@fastify/jwt';

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: { id: string; role: string; exp?: number; email: string };
    user: {
      id: string;
      role: string;
      exp?: number;
      email: string;
    };
  }
}

export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.status(401).send({ message: 'Unauthorized' });
  }
}

export async function requireAdmin(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify();
    if (request.user.role !== 'admin') {
      reply.status(403).send({ message: 'Forbidden: Admin access required' });
    }
  } catch (err) {
    reply.status(401).send({ message: 'Unauthorized' });
  }
}
