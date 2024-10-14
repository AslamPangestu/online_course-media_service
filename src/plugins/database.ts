import fp from 'fastify-plugin'
import { FastifyPluginAsync } from 'fastify'
import { DataSource, Repository } from "typeorm"

import Media from 'models/media'


// Use TypeScript module augmentation to declare the type of server.prisma to be PrismaClient
declare module 'fastify' {
  interface FastifyInstance {
    db: DataSource
    repo: {
      media: Repository<Media>
    }
  }
}

const DatabasePlugin: FastifyPluginAsync = fp(async (server, options) => {
  const AppDataSource = new DataSource({
    type: "postgres",
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || "5432"),
    entities: [Media],
    ssl: true,
    logging: false,
    synchronize: false
  })

  try {

    await AppDataSource.initialize()

    // this object will be accessible from any fastify server instance
    server.decorate("db", AppDataSource)
    server.decorate("repo", {
      media: AppDataSource.getRepository(Media),
    })

    server.addHook('onClose', async (server) => {
      server.db.destroy()
    })
  } catch (error) {
    console.log(error)
    AppDataSource.destroy()
  }
})

export default DatabasePlugin