import grpc
import sqlite3
from concurrent import futures
import movies_pb2
import movies_pb2_grpc

# Povezava na SQLite
conn = sqlite3.connect("movies.db", check_same_thread=False)
cursor = conn.cursor()

# Ustvari tabelo, če še ne obstaja
cursor.execute("""
    CREATE TABLE IF NOT EXISTS movies (
        id INTEGER PRIMARY KEY,
        title TEXT,
        year INTEGER,
        genre TEXT,
        description TEXT,
        actors TEXT
    )
""")
conn.commit()

# Dodaj testni film
cursor.execute("INSERT OR IGNORE INTO movies VALUES (1, 'Inception', 2010, 'Sci-Fi', 'Dreams within dreams', 'Leonardo DiCaprio')")
conn.commit()

class MovieService(movies_pb2_grpc.MovieServiceServicer):
    def GetMovieById(self, request, context):
        cursor.execute("SELECT * FROM movies WHERE id=?", (request.id,))
        row = cursor.fetchone()
        if row:
            return movies_pb2.MovieResponse(
                id=row[0], title=row[1], year=row[2], genre=row[3], description=row[4], actors=[row[5]]
            )
        context.set_code(grpc.StatusCode.NOT_FOUND)
        context.set_details("Film ni najden")
        return movies_pb2.MovieResponse()

def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    movies_pb2_grpc.add_MovieServiceServicer_to_server(MovieService(), server)
    server.add_insecure_port("[::]:50051")
    server.start()
    print("🎬 gRPC strežnik deluje na portu 50051")
    server.wait_for_termination()

if __name__ == "__main__":
    serve()