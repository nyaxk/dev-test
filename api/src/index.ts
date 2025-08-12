import Fastify from 'fastify';
import config from './config';

import { registerPlugins } from './plugins';
import { registerRoutes } from './routes';
import { ZodTypeProvider } from 'fastify-type-provider-zod';

// Cria a instância do Fastify com configuração mínima de logger
const server = Fastify({
  logger: {
    level: 'info',
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname,reqId,responseTime,req,res',
        messageFormat: '{msg} {req.method} {req.url} {args}'
      }
    }
  },
  disableRequestLogging: true,
  pluginTimeout: 30000
}).withTypeProvider<ZodTypeProvider>();

// Inicia o servidor
async function startServer() {
  try {
    await registerPlugins(server);
    await registerRoutes(server);

    const address = await server.listen({
      port: config.PORT,
      host: config.HOST
    });

    // Log essencial - servidor iniciado
    server.log.info(`🚀 Servidor iniciado em: ${address}`);

    await server.ready();

    return server;
  } catch (error) {
    server.log.error({ err: error }, '❌ Falha ao iniciar servidor:');
    process.exit(1);
  }
}

process.on('SIGINT', async () => {
  await server.close();
  process.exit(0);
});

export { server, startServer };