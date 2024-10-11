import type { FastifyInstance, FastifyRequest } from "fastify";
import util from 'util'
import fs from 'fs'
import { pipeline } from 'stream'
import Media from "models/media";

const pump = util.promisify(pipeline)

const routes = async (fastify: FastifyInstance) => {
    fastify.get('/', async (request, reply) => {
        const data = await fastify.repo.media.find()
        return {
            success: true,
            data
        }
    })

    fastify.post('/', async (request, reply) => {
        const data = await request.file()
        if (!data) {
            return { error: `File doesn't exist` }
        }
        await pump(data.file, fs.createWriteStream(`./storage/${data.filename}`))
        const media = new Media()
        media.imagePath = "Timber"
        await fastify.repo.media.save(media)
        return { success: true }
    })

    fastify.delete('/:id', async (request: FastifyRequest<{ Params: { id: string } }>, reply) => {
        const data = await fastify.repo.media.findOneBy({ id: request.params.id })
        if (!data) {
            return { error: `File doesn't exist` }
        }
        try {
            await new Promise((resolve, reject) => {
                fs.unlink(`./storage/${data.imagePath}`, (err) => {
                    if (err) {
                        reject(err)
                    }
                    resolve(true)
                })
            })
            await fastify.repo.media.remove(data)
            return { success: true }
        } catch (error) {
            return { error }
        }
    })
}

export default routes;

