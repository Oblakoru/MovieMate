const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");

const PROTO_PATH = path.join(__dirname, "proto/movies.proto");

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: Number,
  enums: String,
  defaults: true,
  oneofs: true,
});

const moviesProto = grpc.loadPackageDefinition(packageDefinition).movies;

const client = new moviesProto.MovieService(
  "localhost:50051",
  grpc.credentials.createInsecure()
);

module.exports = client;
