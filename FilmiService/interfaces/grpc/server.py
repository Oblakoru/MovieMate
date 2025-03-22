import os
import sys
import grpc
from concurrent import futures

from application.interfaces.use_cases import MovieService
from infrastructure.db.connection import get_db_connection, initialize_db
from infrastructure.repositories.sqlite_repository  import SQLiteMovieRepository
from interfaces.grpc.service_adapter import MovieServiceAdapter

import movies_pb2_grpc


def serve():
    # Set up the database
    conn = get_db_connection()
    initialize_db(conn)

    # Set up the layers
    repository = SQLiteMovieRepository(conn)
    service = MovieService(repository)
    service_adapter = MovieServiceAdapter(service)

    # Set up and start the gRPC server
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    movies_pb2_grpc.add_MovieServiceServicer_to_server(service_adapter, server)
    server.add_insecure_port("[::]:50051")
    print("🚀 gRPC Server started on port 50051")
    server.start()
    server.wait_for_termination()


if __name__ == "__main__":
    serve()