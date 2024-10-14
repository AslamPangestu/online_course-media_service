import type { FastifyInstance, FastifyRequest } from "fastify";

import Media from "models/media";

const routes = async (fastify: FastifyInstance) => {
    fastify.get("/", async (request, reply) => {
        const data = await fastify.repo.media.find();
        return {
            success: true,
            data,
        };
    });

    fastify.post("/", async (request, reply) => {
        if (!request.isMultipart()) {
            return { success: false, error: "Bad Request" };
        }

        const data = await request.file();
        if (!data) {
            return { success: false, error: `File doesn't exist` };
        }

        const { file, error } = await fastify.storage.put(data);
        if (!file) {
            console.error(error);
            return { success: false, error };
        }

        try {
            const media = new Media();
            media.imagePath = file?.path;
            media.filename = file?.filename
            await fastify.repo.media.save(media);
            return { success: true, error: null };
        } catch (error) {
            console.error(error);
            return { success: false, error };
        }
    });

    fastify.delete(
        "/:id",
        async (request: FastifyRequest<{ Params: { id: string } }>, reply) => {
            const data = await fastify.repo.media.findOneBy({
                id: request.params.id,
            });
            if (!data) {
                return { error: `File doesn't exist` };
            }

            const { error } = await fastify.storage.remove(data.filename);
            if (error) {
                return { success: false, error };
            }

            try {
                await fastify.repo.media.remove(data);
                return { success: true, error: null };
            } catch (error) {
                return { success: false, error };
            }
        }
    );
};

export default routes;
