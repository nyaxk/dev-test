import { FastifyInstanceZod } from "@/types";
import z from "zod";

export default function tasksRoutes(fastify: FastifyInstanceZod) {
    // Create
    fastify.post('/', {
        schema: {
            body: z.object({
                title: z.string().min(1),
                description: z.string(),
                subTasks: z.array(
                    z.object({
                        title: z.string(),
                        finished: z.boolean()
                    })
                )
            }),
            response: {
                200: z.string(),
                404: z.string(),
                500: z.string(),
            }
        }
    }, async (request, reply) => {
        try {
            const { title, description, subTasks } = request.body;

            await fastify.prisma.task.create({
                data: {
                    title,
                    description,
                    subTasks: {
                        createMany: {
                            data: subTasks
                        }
                    }
                }
            });

            return reply.code(201).send('Task created successfully');
        } catch (error) {
            fastify.log.error(error);
            return reply.code(500).send('Internal server error');
        }
    })

    // Read
    fastify.get('/', {
        schema: {
            response: {
                200: z.array(
                    z.object({
                        id: z.number(),
                        title: z.string(),
                        description: z.string(),
                        createdAt: z.date(),
                        updatedAt: z.date(),
                        subTasks: z.array(
                            z.object({
                                id: z.number(),
                                title: z.string(),
                                finished: z.boolean(),
                                createdAt: z.date(),
                                updatedAt: z.date()
                            })
                        )
                    })
                ),
                500: z.string()
            }
        }
    }, async (_request, reply) => {
        try {
            const tasks = await fastify.prisma.task.findMany({
                include: {
                    subTasks: true
                }
            });

            return reply.code(200).send(tasks);
        } catch (error) {
            fastify.log.error(error);
            return reply.code(500).send('Internal server error');
        }
    })

    // Update
    fastify.put('/:id', {
        schema: {
            params: z.object({
                id: z.string().transform(val => parseInt(val))
            }),
            body: z.object({
                title: z.string().min(1).optional(),
                description: z.string().optional(),
                subTasks: z.array(
                    z.object({
                        id: z.number().optional(),
                        title: z.string(),
                        finished: z.boolean()
                    })
                ).optional()
            }),
            response: {
                200: z.string(),
                404: z.string(),
                500: z.string(),
            }
        },
    }, async (request, reply) => {
        try {
            const { id } = request.params;
            const { title, description, subTasks } = request.body;

            const task = await fastify.prisma.task.findUnique({
                where: { id },
                include: { subTasks: true }
            });

            if (!task) {
                return reply.code(404).send('Task not found');
            }

            const currentSubTaskIds = task.subTasks.map(st => st.id);
            const updatedSubTaskIds = subTasks?.filter(st => st.id !== undefined).map(st => st.id) ?? [];
            const removedSubTaskIds = currentSubTaskIds.filter(id => !updatedSubTaskIds.includes(id));

            if (removedSubTaskIds.length > 0) {
                await fastify.prisma.subTask.deleteMany({
                    where: {
                        id: { in: removedSubTaskIds }
                    }
                });
            }

            await fastify.prisma.task.update({
                where: { id },
                data: {
                    title,
                    description,
                    subTasks: subTasks
                        ? {
                            upsert: subTasks.map(st => ({
                                where: { id: st.id ?? 0 },
                                update: {
                                    title: st.title,
                                    finished: st.finished
                                },
                                create: {
                                    title: st.title,
                                    finished: st.finished
                                }
                            }))
                        }
                        : undefined
                }
            });

            return reply.code(200).send('Task updated successfully');
        } catch (e) {
            fastify.log.error(e);
            return reply.code(500).send('Internal server error');
        }
    });

    // Delete
    fastify.delete('/:id', {
        schema: {
            params: z.object({
                id: z.string().transform(val => parseInt(val))
            }),
            response: {
                200: z.string(),
                404: z.string(),
                500: z.string(),
            }
        }
    }, async (request, reply) => {
        try {
            const { id } = request.params;

            const task = await fastify.prisma.task.findUnique({
                where: { id }
            });

            if (!task) {
                return reply.code(404).send('Task not found');
            }

            await fastify.prisma.task.delete({
                where: { id }
            });

            return reply.code(200).send('Task deleted successfully');
        } catch (e) {
            fastify.log.error(e);
            return reply.code(500).send('Internal server error');
        }
    })

    fastify.delete('/subtask/:id', {
        schema: {
            params: z.object({
                id: z.string().transform(val => parseInt(val))
            }),
            response: {
                200: z.string(),
                404: z.string(),
                500: z.string(),
            }
        }
    }, async (request, reply) => {
        try {
            const { id } = request.params;

            const subTask = await fastify.prisma.subTask.findUnique({
                where: { id }
            });

            if (!subTask) {
                return reply.code(404).send('Subtask not found');
            }

            await fastify.prisma.subTask.delete({
                where: { id }
            });

            return reply.code(200).send('Subtask deleted successfully');
        } catch (e) {
            fastify.log.error(e);
            return reply.code(500).send('Internal server error');
        }
    })
}