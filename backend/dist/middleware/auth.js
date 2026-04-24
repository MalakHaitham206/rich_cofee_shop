import '@fastify/jwt';
export async function authenticate(request, reply) {
    try {
        await request.jwtVerify();
    }
    catch (err) {
        reply.status(401).send({ message: 'Unauthorized' });
    }
}
export async function requireAdmin(request, reply) {
    try {
        await request.jwtVerify();
        if (request.user.role !== 'admin') {
            reply.status(403).send({ message: 'Forbidden: Admin access required' });
        }
    }
    catch (err) {
        reply.status(401).send({ message: 'Unauthorized' });
    }
}
//# sourceMappingURL=auth.js.map