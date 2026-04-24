import type { FastifyRequest, FastifyReply } from 'fastify';
import '@fastify/jwt';
declare module '@fastify/jwt' {
    interface FastifyJWT {
        payload: {
            id: string;
            role: string;
            exp: number;
            email: string;
        };
        user: {
            id: string;
            role: string;
            exp: number;
            email: string;
        };
    }
}
export declare function authenticate(request: FastifyRequest, reply: FastifyReply): Promise<void>;
export declare function requireAdmin(request: FastifyRequest, reply: FastifyReply): Promise<void>;
//# sourceMappingURL=auth.d.ts.map