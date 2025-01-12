import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_PATH = join(__dirname, 'database.sqlite');

// Initialize database connection
const initializeDatabase = () => {
  // Create database directory if it doesn't exist
  if (!fs.existsSync(__dirname)) {
    fs.mkdirSync(__dirname, { recursive: true });
  }

  // Connect to database
  const db = new sqlite3.Database(
    DB_PATH,
    sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
    (err) => {
      if (err) {
        console.error('Database connection error:', err);
        process.exit(1);
      }
      console.log('Connected to SQLite database');
    }
  );

  // Initialize schema
  db.serialize(() => {
    // Enable WAL mode for better concurrent access
    db.run('PRAGMA journal_mode = WAL');
    db.run('PRAGMA synchronous = NORMAL');

    // Create tables
    db.run(`
      CREATE TABLE IF NOT EXISTS cases (
        id TEXT PRIMARY KEY,
        disease TEXT NOT NULL,
        city TEXT NOT NULL,
        cases INTEGER NOT NULL,
        timestamp TEXT NOT NULL,
        lat REAL NOT NULL,
        lng REAL NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create indexes
    db.run('CREATE INDEX IF NOT EXISTS idx_timestamp ON cases(timestamp)');
    db.run('CREATE INDEX IF NOT EXISTS idx_disease ON cases(disease)');
    db.run('CREATE INDEX IF NOT EXISTS idx_city ON cases(city)');
  });

  return db;
};

const db = initializeDatabase();

const app = express();
app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'http://localhost:4173', // Vite preview
      'https://disease-outbreak-tracker.netlify.app', // Replace with your Netlify domain
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
);
app.use(express.json());

const INDIAN_CITIES = [
  { city: 'Mumbai', state: 'Maharashtra', lat: 19.076, lng: 72.8777 },
  { city: 'Delhi', state: 'Delhi', lat: 28.6139, lng: 77.209 },
  { city: 'Bangalore', state: 'Karnataka', lat: 12.9716, lng: 77.5946 },
  { city: 'Hyderabad', state: 'Telangana', lat: 17.385, lng: 78.4867 },
  { city: 'Chennai', state: 'Tamil Nadu', lat: 13.0827, lng: 80.2707 },
  { city: 'Kolkata', state: 'West Bengal', lat: 22.5726, lng: 88.3639 },
  { city: 'Pune', state: 'Maharashtra', lat: 18.5204, lng: 73.8567 },
  { city: 'Ahmedabad', state: 'Gujarat', lat: 23.0225, lng: 72.5714 },
  { city: 'Jaipur', state: 'Rajasthan', lat: 26.9124, lng: 75.7873 },
  { city: 'Lucknow', state: 'Uttar Pradesh', lat: 26.8467, lng: 80.9462 },
];

const citiesLookup = new Map(
  INDIAN_CITIES.map((city) => [city.city.toLowerCase(), city])
);

// Hard reset database
const resetDatabase = () => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Drop all data
      db.run('DELETE FROM cases', (err) => {
        if (err) {
          console.error('Error clearing database:', err);
          reject(err);
          return;
        }

        // Reset SQLite sequences
        db.run('VACUUM', (err) => {
          if (err) {
            console.error('Error vacuuming database:', err);
            reject(err);
            return;
          }

          console.log('Database reset successful');
          resolve();
        });
      });
    });
  });
};

app.post('/api/reset', async (req, res) => {
  const { command } = req.body;

  if (command !== 'deletedata') {
    return res.status(400).json({ error: 'Invalid command' });
  }

  try {
    await resetDatabase();
    res.json({ message: 'Database reset successful' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to reset database' });
  }
});

app.get('/api/cases', (req, res) => {
  db.all('SELECT * FROM cases ORDER BY timestamp DESC', (err, rows) => {
    if (err) {
      console.error('Error fetching cases:', err);
      res.status(500).json({ error: 'Database error' });
      return;
    }
    res.json(rows);
  });
});

app.post('/api/cases', (req, res) => {
  const { disease, city, cases, timestamp } = req.body;

  if (!disease || !city || !cases || !timestamp) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const cityData = citiesLookup.get(city.toLowerCase());
  if (!cityData) {
    return res.status(400).json({ error: 'Invalid city' });
  }

  const id = Date.now().toString();

  db.run(
    `INSERT INTO cases (id, disease, city, cases, timestamp, lat, lng)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [id, disease, city, cases, timestamp, cityData.lat, cityData.lng],
    function (err) {
      if (err) {
        console.error('Error inserting case:', err);
        res.status(500).json({ error: 'Database error' });
        return;
      }

      res.json({
        id,
        disease,
        city,
        cases,
        timestamp,
        lat: cityData.lat,
        lng: cityData.lng,
      });
    }
  );
});

app.get('/api/cases/historical', (req, res) => {
  const { start_date, end_date } = req.query;

  if (!start_date || !end_date) {
    return res.status(400).json({ error: 'Missing date parameters' });
  }

  db.all(
    'SELECT * FROM cases WHERE timestamp BETWEEN ? AND ? ORDER BY timestamp DESC',
    [start_date, end_date],
    (err, rows) => {
      if (err) {
        console.error('Error fetching historical cases:', err);
        res.status(500).json({ error: 'Database error' });
        return;
      }
      res.json(rows);
    }
  );
});

app.get('/api/alerts', (req, res) => {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  db.all(
    `SELECT disease, SUM(cases) as total_cases
     FROM cases
     WHERE timestamp >= ?
     GROUP BY disease
     HAVING total_cases > 1000`,
    [sevenDaysAgo.toISOString()],
    (err, rows) => {
      if (err) {
        console.error('Error fetching alerts:', err);
        res.status(500).json({ error: 'Database error' });
        return;
      }
      const alerts = rows.map(({ disease, total_cases }) => ({
        id: `${disease}-${Date.now()}`,
        message: `Severe ${disease} outbreak with ${total_cases} cases`,
        severity: 'high',
        timestamp: new Date().toISOString(),
      }));
      res.json(alerts);
    }
  );
});

// Graceful shutdown
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err);
      process.exit(1);
    }
    console.log('Database closed safely');
    process.exit(0);
  });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
