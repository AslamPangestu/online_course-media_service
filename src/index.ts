import fastify from "fastify";
import staticPlugin from "@fastify/static";
import multipartPlugin from "@fastify/multipart";
import path from "path";
import "module-alias/register";
import "reflect-metadata";

import type { FastifyInstance } from "fastify";

import database from "plugins/database";
import routes from "routes";

const server: FastifyInstance = fastify();

server.register(multipartPlugin);
server.register(staticPlugin, {
  root: path.join(__dirname, "../storage"),
  prefix: "/public/",
});
server.register(database);
server.register(routes);

server.get("/ping", async () => {
  return "pong-pong\n";
});

server.listen(
  { port: parseInt(process.env.PORT || "8000"), host: "0.0.0.0" },
  (err, address) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`Server listening at ${address}`);
  }
);
