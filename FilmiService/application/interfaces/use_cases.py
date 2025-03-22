class MovieService:
    def __init__(self, movie_repository):
        self.movie_repository = movie_repository

    def create_movie(self, movie):
        return self.movie_repository.create(movie)

    def get_movie_by_id(self, movie_id):
        return self.movie_repository.get_by_id(movie_id)

    def update_movie(self, movie):
        return self.movie_repository.update(movie)

    def delete_movie(self, movie_id):
        return self.movie_repository.delete(movie_id)

    def search_movies(self, query):
        return self.movie_repository.search(query)