# application/interfaces/repositories.py
from abc import ABC, abstractmethod

class MovieRepository(ABC):
    @abstractmethod
    def create(self, movie):
        pass

    @abstractmethod
    def get_by_id(self, movie_id):
        pass

    @abstractmethod
    def update(self, movie):
        pass

    @abstractmethod
    def delete(self, movie_id):
        pass

    @abstractmethod
    def search(self, query):
        pass