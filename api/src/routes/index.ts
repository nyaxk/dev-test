import config from '@/config';
import { FastifyInstanceZod } from '@/types';
import tasksRoutes from './tasks';


export const registerRoutes = async (fastify: FastifyInstanceZod) => {
    fastify.register((fastify: FastifyInstanceZod) => {
        fastify.register(tasksRoutes, { prefix: '/tasks' });
    }, { prefix: '/api' })

    fastify.get('/api/health', async () => {
        return { status: 'ok', timestamp: new Date().toISOString() };
    });

    fastify.setErrorHandler((error, _request, reply) => {
        fastify.log.error(error);
        reply.code(error.statusCode || 500).send({
            error: config.NODE_ENV === 'production' ? 'Internal Server Error' : error.message
        });
    });
}