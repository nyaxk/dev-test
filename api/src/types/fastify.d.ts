import { User } from '@prisma/index';
import 'fastify';
import '@fastify/jwt';

declare module '@fastify/jwt' {
    interface FastifyJWT {
        payload: {
            id: string;
            email: string;
            role: string;  
        };
        user: {
            id: string;
            email: string;
            role: string;
        };
    }
}

declare module 'fastify' {
    export interface FastifyInstance {
        jwt: JWT;
    }

    export interface FastifyRequest {
        user: User;
    }
}