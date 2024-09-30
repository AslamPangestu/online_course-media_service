import fastify from 'fastify'

const server = fastify()

server.get('/ping', async (request, reply) => {
  return 'pong-pong\n'
})

server.listen({ port: parseInt(process.env.PORT || '8000') }, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`Server listening at ${address}`)
})