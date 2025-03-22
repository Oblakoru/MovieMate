import unittest
import movies_pb2
import movies_pb2_grpc
from server import MovieService

class TestMovieService(unittest.TestCase):
    def setUp(self):
        self.service = MovieService()

    def test_get_movie_by_id(self):
        request = movies_pb2.MovieRequest(id=1)
        response = self.service.GetMovieById(request, None)
        self.assertEqual(response.title, "Inception")

if __name__ == "__main__":
    unittest.main()