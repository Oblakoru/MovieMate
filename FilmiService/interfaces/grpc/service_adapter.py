# interfaces/grpc/service_adapter.py
import grpc
from domain.models import Movie
import movies_pb2
import movies_pb2_grpc


class MovieServiceAdapter(movies_pb2_grpc.MovieServiceServicer):
    def __init__(self, movie_service):
        self.movie_service = movie_service

    def CreateMovie(self, request, context):
        # Convert from gRPC request to domain model
        movie = Movie(
            title=request.title,
            year=request.year,
            genre=request.genre,
            description=request.description,
            actors=list(request.actors)
        )

        # Call the use case
        created_movie = self.movie_service.create_movie(movie)

        # Convert back to gRPC response
        return movies_pb2.MovieResponse(
            id=created_movie.id,
            title=created_movie.title,
            year=created_movie.year,
            genre=created_movie.genre,
            description=created_movie.description,
            actors=created_movie.actors
        )

    def GetMovieById(self, request, context):
        movie = self.movie_service.get_movie_by_id(request.id)

        if movie:
            return movies_pb2.MovieResponse(
                id=movie.id,
                title=movie.title,
                year=movie.year,
                genre=movie.genre,
                description=movie.description,
                actors=movie.actors
            )
        else:
            context.set_code(grpc.StatusCode.NOT_FOUND)
            context.set_details("Movie not found")
            return movies_pb2.MovieResponse()

    def UpdateMovie(self, request, context):
        movie = Movie(
            id=request.id,
            title=request.title,
            year=request.year,
            genre=request.genre,
            description=request.description,
            actors=list(request.actors)
        )

        updated_movie = self.movie_service.update_movie(movie)

        return movies_pb2.MovieResponse(
            id=updated_movie.id,
            title=updated_movie.title,
            year=updated_movie.year,
            genre=updated_movie.genre,
            description=updated_movie.description,
            actors=updated_movie.actors
        )

    def DeleteMovie(self, request, context):
        success = self.movie_service.delete_movie(request.id)

        if success:
            return movies_pb2.DeleteResponse(message="Movie deleted successfully")
        else:
            context.set_code(grpc.StatusCode.NOT_FOUND)
            context.set_details("Movie not found")
            return movies_pb2.DeleteResponse(message="Movie not found")

    def SearchMovies(self, request, context):
        movies = self.movie_service.search_movies(request.query)

        movie_responses = [
            movies_pb2.MovieResponse(
                id=movie.id,
                title=movie.title,
                year=movie.year,
                genre=movie.genre,
                description=movie.description,
                actors=movie.actors
            ) for movie in movies
        ]

        return movies_pb2.MovieList(movies=movie_responses)