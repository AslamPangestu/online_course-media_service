import app from './app'

const server = app()

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