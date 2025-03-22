import grpc
import movies_pb2
import movies_pb2_grpc

channel = grpc.insecure_channel("localhost:50051")
stub = movies_pb2_grpc.MovieServiceStub(channel)

response = stub.CreateMovie(movies_pb2.MovieCreateRequest(
    title="Inception", year=2010, genre="Sci-Fi", description="A mind-bending thriller",
    actors=["Leonardo DiCaprio", "Joseph Gordon-Levitt"]
))

print("Created Movie:", response)

# ✅ Test GetMovieById
movie = stub.GetMovieById(movies_pb2.MovieRequest(id=response.id))
print("Fetched Movie:", movie)

# ✅ Test UpdateMovie
updated_movie = stub.UpdateMovie(movies_pb2.MovieUpdateRequest(
    id=movie.id, title="Inception Updated", year=2010, genre="Sci-Fi", description="An updated description",
    actors=["Leonardo DiCaprio", "Joseph Gordon-Levitt"]
))
print("Updated Movie:", updated_movie)

# ✅ Test DeleteMovie
delete_response = stub.DeleteMovie(movies_pb2.MovieRequest(id=movie.id))
print(delete_response.message)

# ✅ Test SearchMovies
search_results = stub.SearchMovies(movies_pb2.SearchRequest(query="Sci-Fi"))
print("Search Results:", search_results)