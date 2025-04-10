import grpc
import movies_pb2
import movies_pb2_grpc
from flask import Blueprint, jsonify, request

# Set up the gRPC channel and client
channel = grpc.insecure_channel('localhost:50051')
movie_stub = movies_pb2_grpc.MovieServiceStub(channel)

# Create a Blueprint for movie-related routes
movie_routes = Blueprint('movie_routes', __name__)

# Route to create a movie via gRPC
@movie_routes.route('/', methods=['POST'])
def create_movie():
    data = request.get_json()
    movie_request = movies_pb2.MovieCreateRequest(
        title=data.get('title'),
        year=data.get('year'),
        genre=data.get('genre'),
        description=data.get('description'),
        actors=data.get('actors', [])
    )
    response = movie_stub.CreateMovie(movie_request)
    return jsonify({
        "id": response.id,
        "title": response.title,
        "year": response.year,
        "genre": response.genre,
        "description": response.description,
        "actors": list(response.actors)  # Convert to Python list
    }), 201

# Route to get movie by ID via gRPC
@movie_routes.route('/<int:id>', methods=['GET'])
def get_movie_by_id(id):
    movie_request = movies_pb2.MovieRequest(id=id)
    response = movie_stub.GetMovieById(movie_request)
    return jsonify({
        "id": response.id,
        "title": response.title,
        "year": response.year,
        "genre": response.genre,
        "description": response.description,
        "actors": list(response.actors)  # Convert to Python list
    }), 200

# Route to update a movie via gRPC
@movie_routes.route('/<int:id>', methods=['PUT'])
def update_movie(id):
    data = request.get_json()
    movie_update_request = movies_pb2.MovieUpdateRequest(
        id=id,
        title=data.get('title'),
        year=data.get('year'),
        genre=data.get('genre'),
        description=data.get('description'),
        actors=data.get('actors', [])
    )
    response = movie_stub.UpdateMovie(movie_update_request)
    return jsonify({
        "id": response.id,
        "title": response.title,
        "year": response.year,
        "genre": response.genre,
        "description": response.description,
        "actors": list(response.actors)  # Convert to Python list
    }), 200

# Route to delete a movie via gRPC
@movie_routes.route('/<int:id>', methods=['DELETE'])
def delete_movie(id):
    movie_request = movies_pb2.MovieRequest(id=id)
    response = movie_stub.DeleteMovie(movie_request)
    return jsonify({"message": response.message}), 200

# Route to search movies via gRPC
@movie_routes.route('/search', methods=['GET'])
def search_movies():
    query = request.args.get('query', '')
    search_request = movies_pb2.SearchRequest(query=query)
    response = movie_stub.SearchMovies(search_request)
    movies = [{
        "id": movie.id,
        "title": movie.title,
        "year": movie.year,
        "genre": movie.genre,
        "description": movie.description,
        "actors": list(movie.actors)  # Convert to Python list
    } for movie in response.movies]
    return jsonify(movies), 200