import fastify from "fastify";
import staticPlugin from "@fastify/static";
import multipartPlugin from "@fastify/multipart";
import path from "path";
import "module-alias/register";
import "reflect-metadata";

import type { FastifyInstance } from "fastify";

import database from "plugins/database";
import storage from "plugins/storage";
import routes from "routes";


const build = (options = {}): FastifyInstance => {
    const server: FastifyInstance = fastify(options);

    server.register(multipartPlugin);
    server.register(staticPlugin, {
        root: path.join(__dirname, "../storage"),
        prefix: "/public/",
    });
    server.register(database);
    server.register(storage);
    server.register(routes);

    server.get("/ping", async () => {
        return "pong-pong\n";
    });
    return server
}

export default build
