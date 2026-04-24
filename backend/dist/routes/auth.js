import { z } from 'zod';
import supabase from '../lib/supabase.js';
import { authenticate } from '../middleware/auth.js';
const registerSchema = z.object({
    name: z.string().min(2),
    email: z.email(),
    password: z.string().min(6),
});
const loginSchema = z.object({
    email: z.email(),
    password: z.string().min(6),
});
export default async function authRoutes(fastify) {
    fastify.post('/register', async (request, reply) => {
        try {
            const { name, email, password } = registerSchema.parse(request.body);
            // Create user in Supabase Auth
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        name,
                        role: 'customer',
                        email,
                    },
                },
            });
            if (authError) {
                return reply.status(400).send({ message: authError.message });
            }
            if (!authData.user) {
                return reply.status(400).send({ message: 'Failed to create user' });
            }
            // Insert profile in the database
            const { error: profileError } = await supabase.from('profiles').insert([
                {
                    id: authData.user.id,
                    name,
                    role: 'customer',
                },
            ]);
            if (profileError) {
                // If profile creation fails, it's good practice to delete the auth user,
                // but for simplicity here we just return the error.
                return reply.status(500).send({ message: profileError.message });
            }
            return reply.send({ message: 'Registered successfully' });
        }
        catch (error) {
            if (error instanceof z.ZodError) {
                return reply.status(400).send({ message: 'Validation error', errors: error.errors });
            }
            fastify.log.error(error);
            return reply.status(500).send({ message: 'Internal Server Error' });
        }
    });
    fastify.post('/login', async (request, reply) => {
        try {
            const { email, password } = loginSchema.parse(request.body);
            const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            if (authError || !authData.user) {
                return reply.status(401).send({ message: 'Invalid email or password' });
            }
            // Fetch user role from profiles table
            const { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .select('name, role')
                .eq('id', authData.user.id)
                .single();
            if (profileError || !profileData) {
                return reply.status(500).send({ message: 'Failed to fetch user profile' });
            }
            // Generate Fastify JWT token
            const token = fastify.jwt.sign({
                id: authData.user.id,
                role: profileData.role,
                exp: 60 * 60 * 24 * 7, // 7 days
                email: email,
            });
            return reply.send({
                message: 'Logged in successfully',
                token,
                user: {
                    id: authData.user.id,
                    name: profileData.name,
                    email: authData.user.email,
                    role: profileData.role,
                },
            });
        }
        catch (error) {
            if (error instanceof z.ZodError) {
                return reply.status(400).send({ message: 'Validation error', errors: error.errors });
            }
            fastify.log.error(error);
            return reply.status(500).send({ message: 'Internal Server Error' });
        }
    });
    fastify.post('/forget-password', async (request, reply) => {
        try {
            const { email } = request.body;
            const { error } = await supabase.auth.resetPasswordForEmail(email);
            if (error) {
                return reply.status(400).send({ message: error.message });
            }
            return reply.send({ message: 'Password reset email sent successfully' });
        }
        catch (error) {
            fastify.log.error(error);
            return reply.status(500).send({ message: 'Internal Server Error' });
        }
    });
    //Current user profile — protected
    fastify.get('/me', { preHandler: authenticate }, async (request, reply) => {
        try {
            const { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .select('name, role')
                .eq('id', request.user.id)
                .single();
            if (profileError || !profileData) {
                return reply.status(500).send({ message: 'Failed to fetch user profile' });
            }
            return reply.send({
                user: {
                    id: request.user.id,
                    name: profileData.name,
                    email: request.user.email,
                    role: profileData.role,
                },
            });
        }
        catch (error) {
            fastify.log.error(error);
            return reply.status(500).send({ message: 'Internal Server Error' });
        }
    });
}
//# sourceMappingURL=auth.js.map