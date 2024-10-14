import fp from 'fastify-plugin'
import { FastifyPluginAsync } from 'fastify'

import Storage from "lib/storage";
import type StorageInterface from "lib/storage/type";

// Use TypeScript module augmentation to declare the type of server.prisma to be PrismaClient
declare module 'fastify' {
  interface FastifyInstance {
    storage: StorageInterface
  }
}

const StoragePlugin: FastifyPluginAsync = fp(async (server, options) => {
  const type = process.env.STORAGE || "local"

  try {
    const storage: StorageInterface = Storage(type)
    
    // this object will be accessible from any fastify server instance
    server.decorate("storage", storage)
  } catch (error) {
    console.log(error)
  }
})

export default StoragePlugin