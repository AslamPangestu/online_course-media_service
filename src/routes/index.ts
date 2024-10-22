import type { FastifyInstance, FastifyRequest } from "fastify";

import Media from "models/media";

const routes = async (fastify: FastifyInstance) => {
    fastify.get("/", async (request, reply) => {
        const data: Array<Media> = await fastify.repo.media.find();
        return {
            error: null,
            data,
        };
    });

    fastify.post("/", async (request, reply) => {
        if (!request.isMultipart()) {
            return { data: null, error: "Bad Request" };
        }

        const data = await request.file();
        if (!data) {
            return { data: null, error: `File doesn't exist` };
        }

        const { file, error } = await fastify.storage.put(data);
        if (!file) {
            console.error(error);
            return { data: null, error };
        }

        try {
            const media: Media = new Media();
            media.imagePath = file?.path;
            media.filename = file?.filename;
            const result: Media = await fastify.repo.media.save(media);
            return { data: result, error: null };
        } catch (error) {
            console.error(error);
            return { data: null, error };
        }
    });

    fastify.delete(
        "/:id",
        async (request: FastifyRequest<{ Params: { id: string } }>, reply) => {
            const data: Media | null = await fastify.repo.media.findOneBy({
                id: request.params.id,
            });
            if (!data) {
                return { error: `File doesn't exist` };
            }

            const { error } = await fastify.storage.remove(data.filename);
            if (error) {
                return { error };
            }

            try {
                await fastify.repo.media.remove(data);
                return { error: null };
            } catch (error) {
                return { error };
            }
        },
    );
};

export default routes;
