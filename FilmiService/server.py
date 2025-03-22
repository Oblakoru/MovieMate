import grpc
from concurrent import futures
import sqlite3
import movies_pb2
import movies_pb2_grpc


def get_db_connection():
    conn = sqlite3.connect("movies.db", check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn


# Create the production database if it doesn't exist
def initialize_production_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS movies (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT,
            year INTEGER,
            genre TEXT,
            description TEXT,
            actors TEXT
        )
    ''')
    conn.commit()
    conn.close()


class MovieService(movies_pb2_grpc.MovieServiceServicer):

    def __init__(self, db_connection=None):
        self.conn = db_connection if db_connection else get_db_connection()
        # Set row_factory if it's not already set
        if not hasattr(self.conn, 'row_factory') or self.conn.row_factory is None:
            self.conn.row_factory = sqlite3.Row
        self.cursor = self.conn.cursor()

    def CreateMovie(self, request, context):
        # Use the instance connection instead of creating a new one
        self.cursor.execute("INSERT INTO movies (title, year, genre, description, actors) VALUES (?, ?, ?, ?, ?)",
                            (request.title, request.year, request.genre, request.description, ",".join(request.actors)))
        self.conn.commit()
        movie_id = self.cursor.lastrowid
        return movies_pb2.MovieResponse(id=movie_id, title=request.title, year=request.year, genre=request.genre,
                                        description=request.description, actors=request.actors)

    def GetMovieById(self, request, context):
        self.cursor.execute("SELECT * FROM movies WHERE id=?", (request.id,))
        row = self.cursor.fetchone()

        if row:
            return movies_pb2.MovieResponse(id=row["id"], title=row["title"], year=row["year"], genre=row["genre"],
                                            description=row["description"], actors=row["actors"].split(","))
        else:
            if context:  # Check if context is provided (not None)
                context.set_code(grpc.StatusCode.NOT_FOUND)
                context.set_details("Movie not found")
            return movies_pb2.MovieResponse()

    def UpdateMovie(self, request, context):
        self.cursor.execute("UPDATE movies SET title=?, year=?, genre=?, description=?, actors=? WHERE id=?",
                            (request.title, request.year, request.genre, request.description, ",".join(request.actors),
                             request.id))
        self.conn.commit()
        return movies_pb2.MovieResponse(id=request.id, title=request.title, year=request.year, genre=request.genre,
                                        description=request.description, actors=request.actors)

    def DeleteMovie(self, request, context):
        self.cursor.execute("DELETE FROM movies WHERE id=?", (request.id,))
        self.conn.commit()
        return movies_pb2.DeleteResponse(message="Movie deleted successfully")

    def SearchMovies(self, request, context):
        self.cursor.execute("SELECT * FROM movies WHERE title LIKE ? OR genre LIKE ?",
                            ('%' + request.query + '%', '%' + request.query + '%'))
        movies = [movies_pb2.MovieResponse(id=row["id"], title=row["title"], year=row["year"], genre=row["genre"],
                                           description=row["description"], actors=row["actors"].split(","))
                  for row in self.cursor.fetchall()]
        return movies_pb2.MovieList(movies=movies)


# Start the gRPC Server
def serve():
    # Initialize the production database
    initialize_production_db()

    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    movies_pb2_grpc.add_MovieServiceServicer_to_server(MovieService(), server)
    server.add_insecure_port("[::]:50051")
    print("🚀 gRPC Server started on port 50051")
    server.start()
    server.wait_for_termination()


if __name__ == "__main__":
    serve()