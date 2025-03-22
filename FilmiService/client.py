import grpc
import movies_pb2
import movies_pb2_grpc

def run():
    channel = grpc.insecure_channel("localhost:50051")
    stub = movies_pb2_grpc.MovieServiceStub(channel)

    response = stub.GetMovieById(movies_pb2.MovieRequest(id=1))
    if response.id:
        print(f"🎬 Film: {response.title} ({response.year}), {response.genre}")
    else:
        print("❌ Film ni najden.")

if __name__ == "__main__":
    run()


