import os
import sys
import unittest
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

import movies_pb2
import movies_pb2_grpc
import sqlite3

from domain.models import Movie
from application.interfaces.use_cases import MovieService
from infrastructure.repositories.sqlite_repository import SQLiteMovieRepository
from interfaces.grpc.service_adapter import MovieServiceAdapter


class TestMovieGrpcService(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.conn = sqlite3.connect(":memory:")  # ✅ Use in-memory DB for tests
        cls.conn.row_factory = sqlite3.Row
        cls.cursor = cls.conn.cursor()

        cls.cursor.execute('''
            CREATE TABLE movies (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT,
                year INTEGER,
                genre TEXT,
                description TEXT,
                actors TEXT
            )
        ''')
        cls.conn.commit()

        # Set up clean architecture components
        cls.repository = SQLiteMovieRepository(cls.conn)
        cls.movie_service = MovieService(cls.repository)
        cls.grpc_service = MovieServiceAdapter(cls.movie_service)

    def setUp(self):
        """Truncate the database before each test and reset auto-increment."""
        self.cursor.execute("DELETE FROM movies")  # Delete all rows
        self.cursor.execute("DELETE FROM sqlite_sequence WHERE name='movies'")  # Reset ID counter
        self.conn.commit()

    def test_create_movie(self):
        """Test creating a new movie"""
        request = movies_pb2.MovieCreateRequest(
            title="Inception", year=2010, genre="Sci-Fi",
            description="A mind-bending thriller",
            actors=["Leonardo DiCaprio", "Joseph Gordon-Levitt"]
        )

        response = self.grpc_service.CreateMovie(request, None)
        self.assertEqual(response.id, 1)  # First movie should have ID 1
        self.assertEqual(response.title, "Inception")

    def test_get_movie_by_id(self):
        """Test retrieving a movie by ID"""
        create_request = movies_pb2.MovieCreateRequest(
            title="Interstellar", year=2014, genre="Sci-Fi",
            description="A journey through space and time",
            actors=["Matthew McConaughey", "Anne Hathaway"]
        )

        create_response = self.grpc_service.CreateMovie(create_request, None)
        request = movies_pb2.MovieRequest(id=create_response.id)
        response = self.grpc_service.GetMovieById(request, None)

        self.assertEqual(response.title, "Interstellar")
        self.assertEqual(response.year, 2014)
        self.assertEqual(response.genre, "Sci-Fi")

    def test_update_movie(self):
        """Test updating an existing movie"""
        create_request = movies_pb2.MovieCreateRequest(
            title="Old Title", year=2000, genre="Drama",
            description="Old description",
            actors=["Old Actor"]
        )

        create_response = self.grpc_service.CreateMovie(create_request, None)

        update_request = movies_pb2.MovieUpdateRequest(
            id=create_response.id, title="New Title", year=2022, genre="Sci-Fi",
            description="Updated description",
            actors=["New Actor"]
        )
        response = self.grpc_service.UpdateMovie(update_request, None)

        self.assertEqual(response.id, create_response.id)
        self.assertEqual(response.title, "New Title")
        self.assertEqual(response.year, 2022)

    def test_delete_movie(self):
        """Test deleting a movie"""
        create_request = movies_pb2.MovieCreateRequest(
            title="To be deleted", year=2021, genre="Thriller",
            description="Temporary movie",
            actors=["Actor A"]
        )

        create_response = self.grpc_service.CreateMovie(create_request, None)

        delete_request = movies_pb2.MovieRequest(id=create_response.id)
        response = self.grpc_service.DeleteMovie(delete_request, None)

        self.assertEqual(response.message, "Movie deleted successfully")

    def test_search_movies(self):
        """Test searching for movies by title"""
        self.grpc_service.CreateMovie(movies_pb2.MovieCreateRequest(
            title="Searchable Movie", year=2015, genre="Action",
            description="Test movie",
            actors=["Actor B"]
        ), None)

        search_request = movies_pb2.SearchRequest(query="Searchable")
        response = self.grpc_service.SearchMovies(search_request, None)

        self.assertGreater(len(response.movies), 0)
        self.assertEqual(response.movies[0].title, "Searchable Movie")


if __name__ == "__main__":
    unittest.main()