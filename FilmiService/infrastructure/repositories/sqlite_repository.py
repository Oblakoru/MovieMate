from domain.models import Movie
from application.interfaces.repositories import MovieRepository

class SQLiteMovieRepository(MovieRepository):
    def __init__(self, connection):
        self.conn = connection
        self.cursor = self.conn.cursor()

    def create(self, movie):
        self.cursor.execute(
            "INSERT INTO movies (title, year, genre, description, actors) VALUES (?, ?, ?, ?, ?)",
            (movie.title, movie.year, movie.genre, movie.description, ",".join(movie.actors))
        )
        self.conn.commit()
        movie_id = self.cursor.lastrowid
        movie.id = movie_id
        return movie

    def get_by_id(self, movie_id):
        self.cursor.execute("SELECT * FROM movies WHERE id=?", (movie_id,))
        row = self.cursor.fetchone()
        if row:
            return Movie(
                id=row["id"],
                title=row["title"],
                year=row["year"],
                genre=row["genre"],
                description=row["description"],
                actors=row["actors"].split(",") if row["actors"] else []
            )
        return None

    def update(self, movie):
        self.cursor.execute(
            "UPDATE movies SET title=?, year=?, genre=?, description=?, actors=? WHERE id=?",
            (movie.title, movie.year, movie.genre, movie.description,
             ",".join(movie.actors), movie.id)
        )
        self.conn.commit()
        return movie

    def delete(self, movie_id):
        self.cursor.execute("DELETE FROM movies WHERE id=?", (movie_id,))
        self.conn.commit()
        return True

    def search(self, query):
        self.cursor.execute(
            "SELECT * FROM movies WHERE title LIKE ? OR genre LIKE ?",
            ('%' + query + '%', '%' + query + '%')
        )
        return [
            Movie(
                id=row["id"],
                title=row["title"],
                year=row["year"],
                genre=row["genre"],
                description=row["description"],
                actors=row["actors"].split(",") if row["actors"] else []
            )
            for row in self.cursor.fetchall()
        ]