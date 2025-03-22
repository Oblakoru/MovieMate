class Movie:
    def __init__(self, id=None, title="", year=0, genre="", description="", actors=None):
        self.id = id
        self.title = title
        self.year = year
        self.genre = genre
        self.description = description
        self.actors = actors or []