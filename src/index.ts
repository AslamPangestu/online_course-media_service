import fastify from "fastify";
import 'module-alias/register';
import "reflect-metadata"

import database from 'plugins/database'
import Media from "models/media";

const server = fastify();

server.register(database)

server.get("/ping", async (request, reply) => {
  return "pong-pong\n";
});

server.get("/insert", async (request, reply) => {
  const data = new Media()
  data.imagePath="Hai"

  await server.repo.media.save(data)
  return "success\n";
});

server.get("/get", async (request, reply) => {
  const savedPhotos = await server.repo.media.find()
  return savedPhotos;
});

server.listen(
  { port: parseInt(process.env.PORT || "8000"), host: "0.0.0.0" },
  (err, address) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`Server listening at ${address}`);
  },
);
