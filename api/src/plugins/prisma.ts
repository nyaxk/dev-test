import { FastifyPluginAsync } from 'fastify';
import { PrismaClient } from '@prisma/client';
import fp from 'fastify-plugin';
import config from '@/config';

const prisma = new PrismaClient({
  log: config.LOG_LEVEL
});

declare module 'fastify' {
  interface FastifyInstance {
    prisma: typeof prisma;
  }
}

const plugin: FastifyPluginAsync = async (fastify) => {
  try {
    await prisma.$connect();
    fastify.log.info('✅ Prisma conectado ao banco de dados');
    fastify.decorate('prisma', prisma);
    fastify.addHook('onClose', async (instance) => {
      try {
        await instance.prisma.$disconnect();
        fastify.log.info('Prisma desconectado com sucesso');
      } catch (error) {
        fastify.log.error('Erro ao desconectar Prisma:', error);
      }
    });
    await prisma.$queryRaw`SELECT 1`;
    fastify.log.info('✅ Prisma está respondendo corretamente');
  } catch (error) {
    fastify.log.error('❌ Falha ao conectar ao banco de dados:', error);
    process.exit(1);
  }
};

export default fp(plugin, {
  name: 'queue',
  fastify: '5.x',
  dependencies: [],
});
