import { FastifyInstance } from "fastify";
import { prisma } from '../lib/prisma'
import { z } from 'zod'

export async function memoriesRoutes (app: FastifyInstance) {
    app.get('/memories', async () => {
        const memories = prisma.memory.findMany({
            orderBy: {
                createdAt: 'asc'
            }
        })

        return memories.map((memory: any) => {
            return {
                id: memory.id,
                coverUrl: memory.coverUrl,
                excerpt:  memory.content.substring(0, 115).concat('...')
            }
        })
    })

    app.get('/memories/:id', async (request) => {
        const paramsSchema = z.object({
            id: z.string()
        })

        const { id } = paramsSchema.parse(request.params)

        const memory = await prisma.memory.findUniqueOrThrow({
          where: {
            id
          }
        })

        return memory
    })

    app.post('/memories', async (request) => {
        const bodySchema = z.object({
            content: z.string(),
            coverUrl: z.string(),
            isPublic: z.coerce.boolean().default(false)
        })

        const { content, coverUrl, isPublic } = bodySchema.parse(request.body)

        const memory = await prisma.memory.create({
            data: {
                content,
                coverUrl,
                isPublic,
                userId: '68886cb8-2d86-41fe-ae6b-a5e8e05f37e2'
            }
        })

        return memory
    })

    app.put('/memories/:id', async (request) => {
        const paramsSchema = z.object({
            id: z.string()
        })

        const { id } = paramsSchema.parse(request.params)

        const bodySchema = z.object({
            content: z.string(),
            coverUrl: z.string(),
            isPublic: z.coerce.boolean().default(false)
        })

        const { content, coverUrl, isPublic } = bodySchema.parse(request.body)

        const memory = await prisma.memory.update({
            where: {
                id
            },
            data: {
                content,
                coverUrl,
                isPublic
            }
        })

        return memory
    })

    app.delete('/memories/:id', async (request) => {
        const paramsSchema = z.object({
            id: z.string()
        })

        const { id } = paramsSchema.parse(request.params)

        await prisma.memory.delete({
          where: {
            id
          }
        })
    })
}