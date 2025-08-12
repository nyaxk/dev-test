import dotenv from 'dotenv';
dotenv.config();
import z from 'zod';

export enum Environment {
    DEVELOPMENT = 'development',
    STAGING = 'staging',
    PRODUCTION = 'production'
}

export type DefaultLogLevel = 'info' | 'query' | 'warn' | 'error';
export type LogDefinition = {
    level: DefaultLogLevel;
    emit: 'stdout' | 'event';
};
export type LogLevel = (DefaultLogLevel | LogDefinition)[];

// Schema para LOG_LEVEL
const logLevelSchema = z.union([
    z.enum(['info', 'query', 'warn', 'error']),
    z.object({
        level: z.enum(['info', 'query', 'warn', 'error']),
        emit: z.enum(['stdout', 'event'])
    })
]);

const envSchema = z.object({
    // NODE
    NODE_ENV: z.nativeEnum(Environment),
    HOST: z.string(),
    PORT: z.coerce.number(), // já converte direto pra number
    // DATABASE
    DATABASE_URL: z.string().url(),
    LOG_LEVEL: z.preprocess((val) => {
        // Permite que venha como JSON no .env
        if (typeof val === 'string') {
            try {
                return JSON.parse(val);
            } catch {
                return val;
            }
        }
        return val;
    }, z.array(logLevelSchema)).default(['info', 'query', 'warn', 'error'])
});

const env = envSchema.parse(process.env);

export default env;
