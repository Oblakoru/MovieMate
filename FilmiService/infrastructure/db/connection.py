import sqlite3

def get_db_connection(db_path="movies.db"):
    conn = sqlite3.connect(db_path, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn

def initialize_db(connection):
    cursor = connection.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS movies (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT,
            year INTEGER,
            genre TEXT,
            description TEXT,
            actors TEXT
        )
    ''')
    connection.commit()