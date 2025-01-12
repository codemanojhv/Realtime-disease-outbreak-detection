import sqlite3
from contextlib import contextmanager

DATABASE_NAME = 'disease_tracker.db'

def init_db():
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS cases (
                id TEXT PRIMARY KEY,
                disease TEXT,
                city TEXT,
                cases INTEGER,
                timestamp TEXT,
                lat REAL,
                lng REAL
            )
        ''')
        conn.commit()

@contextmanager
def get_db():
    conn = sqlite3.connect(DATABASE_NAME)
    try:
        yield conn
    finally:
        conn.close()