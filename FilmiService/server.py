import grpc
import logging
from concurrent import futures

from application.interfaces.use_cases import MovieService
from infrastructure.db.connection import get_db_connection, initialize_db
from infrastructure.repositories.sqlite_repository import SQLiteMovieRepository
from interfaces.grpc.service_adapter import MovieServiceAdapter

from auth_interceptor import AuthInterceptor
import movies_pb2_grpc

# ✅ Setup logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
    handlers=[
        logging.FileHandler("grpc_server.log"),
        logging.StreamHandler()
    ]
)

logger = logging.getLogger(__name__)

def serve():
    logger.info("Starting GRPC server...")

    try:
        conn = get_db_connection()
        initialize_db(conn)

        repository = SQLiteMovieRepository(conn)
        service = MovieService(repository)
        service_adapter = MovieServiceAdapter(service)

        auth_interceptor = AuthInterceptor()

        server = grpc.server(futures.ThreadPoolExecutor(max_workers=10),
                             interceptors=(auth_interceptor,)
                             )

        movies_pb2_grpc.add_MovieServiceServicer_to_server(service_adapter, server)
        server.add_insecure_port("[::]:50051")

        logger.info("gRPC Server started on port 50051")
        server.start()
        server.wait_for_termination()

    except Exception as e:
        logger.error(f"Server failed to start: {e}", exc_info=True)

if __name__ == "__main__":
    serve()