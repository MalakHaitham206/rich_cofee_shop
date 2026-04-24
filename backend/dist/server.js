import Fastify from 'fastify';
import jwt from '@fastify/jwt';
import dotenv from 'dotenv';
import cors from '@fastify/cors';
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import categoryRoutes from './routes/categories.js';
import orderRoutes from './routes/orders.js';
import adminRoutes from './routes/admin.js';
dotenv.config();
const app = Fastify();
app.register(cors);
app.register(jwt, {
    secret: process.env.JWT_SECRET,
});
app.register(authRoutes, { prefix: '/auth' });
app.register(productRoutes, { prefix: '/products' });
app.register(categoryRoutes, { prefix: '/categories' });
app.register(orderRoutes, { prefix: '/orders' });
app.register(adminRoutes, { prefix: '/admin' });
app.get('/', async (request, reply) => {
    return { message: 'welcome to rich coffee shop backend' };
});
app.listen({ port: 3000 }, (err, address) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log(`Server running at ${address}`);
});
export default app;
//# sourceMappingURL=server.js.map