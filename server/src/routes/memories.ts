import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import { z } from 'zod';

export async function memoriesRoutes(app: FastifyInstance) {
  app.addHook('preHandler', async (request) => {
    await request.jwtVerify()
  })

  // GetAll
  app.get("/memories", async (request) => {
    const memories = await prisma.memory.findMany({
      where: {
        userId: request.user.sub
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    return memories.map(memory => {
      let excerpt = memory.content;

      if (excerpt.length > 115) {
        excerpt = excerpt.substring(0, 115).concat("...");
      }

      return {
        id: memory.id,
        coverUrl: memory.coverUrl,
        excerpt: excerpt,
        createdAt: memory.createdAt
      }
    });
  });

  // GetById
  app.get("/memories:id", async (request, reply) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = paramsSchema.parse(request.params);

    const memory = await prisma.memory.findUniqueOrThrow({
      where: {
        id,
      }
    })

    if (!memory.isPublic && memory.userId != request.user.sub) {
      return reply.status(401).send();
    }

    return memory;
  });

  // Create
  app.post("/memories", async (request) => {
    const bodySchema = z.object({
      content: z.string(),
      coverUrl: z.string(),
      isPublic: z.coerce.boolean().default(false)
    })

    const { content, coverUrl, isPublic } = bodySchema.parse(request.body);

    const memory = await prisma.memory.create({
      data: {
        content,
        coverUrl,
        isPublic,
        userId: request.user.sub
      }
    })

    return memory;
  });

  // Update
  app.put("/memories:id", async (request, reply) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = paramsSchema.parse(request.params);

    const bodySchema = z.object({
      content: z.string(),
      coverUrl: z.string(),
      isPublic: z.coerce.boolean().default(false)
    })

    const { content, coverUrl, isPublic } = bodySchema.parse(request.body);

    let memory = await prisma.memory.findUniqueOrThrow({
      where: {
        id,
      }
    })

    if (memory.userId != request.user.sub) {
      return reply.status(401).send();
    }

    memory = await prisma.memory.update({
      where: {
        id,
      },
      data: {
        content,
        coverUrl,
        isPublic
      }
    })

    return memory
  });

  // Delete
  app.delete("/memories:id", async (request, reply) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = paramsSchema.parse(request.params);

    const memory = await prisma.memory.findUniqueOrThrow({
      where: {
        id,
      }
    })

    if (memory.userId != request.user.sub) {
      return reply.status(401).send();
    }

    await prisma.memory.delete({
      where: {
        id,
      }
    })
  });
}