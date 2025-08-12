import { FastifyInstance } from "fastify";
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';
import prisma from "./prisma";
import cors from '@fastify/cors';

export const registerPlugins = async (fastify: FastifyInstance): Promise<void> => {
    fastify.setValidatorCompiler(validatorCompiler);
    fastify.setSerializerCompiler(serializerCompiler);
    await fastify.register(prisma);
    await fastify.register(cors, {
        origin: true,
        credentials: true,
        methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS', 'PATCH'],
        allowedHeaders: ['Content-Type', 'Authorization', 'Accept-Language', 'Accept'],
        exposedHeaders: ['Set-Cookie'],
    });
}