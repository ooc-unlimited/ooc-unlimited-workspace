const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = 3001;

// Initialize SQLite database
const dbPath = path.join(__dirname, 'data', 'onboarding.db');
let db;

// Ensure data directory exists
const ensureDataDir = async () => {
  try {
    await fs.mkdir(path.join(__dirname, 'data'), { recursive: true });
  } catch (err) {
    // Directory already exists
  }
};

// Initialize database
const initDatabase = async () => {
  await ensureDataDir();
  db = new sqlite3.Database(dbPath);
  
  // Create tables if they don't exist
  db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      date TEXT NOT NULL,
      time TEXT NOT NULL,
      location TEXT,
      description TEXT,
      capacity INTEGER DEFAULT 50,
      guests INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
    
    db.run(`CREATE TABLE IF NOT EXISTS agents (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE,
      phone TEXT,
      agent_code TEXT UNIQUE,
      status TEXT DEFAULT 'active',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
    
    db.run(`CREATE TABLE IF NOT EXISTS event_guests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      event_id INTEGER,
      name TEXT NOT NULL,
      email TEXT,
      phone TEXT,
      rsvp_status TEXT DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (event_id) REFERENCES events (id)
    )`);
  });
  
  console.log('📊 Database initialized:', dbPath);
};

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Set EJS as template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes

// Homepage - Gary Life Index
app.get('/', (req, res) => {
  res.render('homepage', {
    title: 'Gary Cosby | Life Insurance & Financial Services | OOC Unlimited',
    description: 'Protecting families and building futures. Personalized life insurance solutions — IUL, Whole Life, Term Life. Mission before commission.'
  });
});

// Join page
app.get('/join', (req, res) => {
  res.render('join', {
    title: 'Join GFI × Team OOC — Build Your Financial Services Career | Gary Cosby — OOC Unlimited',
    description: 'Join GFI × Team OOC and build a life-changing career in financial services. Up to 133% compensation, 30+ A-rated carriers, proven training system, ownership program, and mission-driven culture. Start today.'
  });
});

// Links page
app.get('/links', (req, res) => {
  res.render('links', {
    title: 'Quick Links | Everything You Need — In One Place',
    description: 'Organized for the builders. Built for the winners.'
  });
});

// Login page
app.get('/login', (req, res) => {
  res.render('login', {
    title: 'Login | Gary Cosby — OOC Unlimited'
  });
});

// Admin routes (protected) - specific routes
app.get('/admin/dashboard', (req, res) => res.redirect('/login'));
app.get('/admin/grand-opening', (req, res) => res.redirect('/login'));
app.get('/admin/onboarding', (req, res) => res.redirect('/login'));
app.get('/admin/pfr', (req, res) => res.redirect('/login'));
app.get('/admin/annuity-intake', (req, res) => res.redirect('/login'));
app.get('/admin', (req, res) => res.redirect('/login'));

// Grand opening routes
app.get('/grand-opening/:id/invite', (req, res) => {
  const eventId = req.params.id;
  
  db.get('SELECT * FROM events WHERE id = ?', [eventId], (err, event) => {
    if (err || !event) {
      return res.status(404).render('404');
    }
    
    res.render('grand-opening-invite', {
      event,
      title: `${event.title} - Grand Opening Invitation`,
      description: `Join us for ${event.title} on ${event.date}`
    });
  });
});

// API Routes
app.get('/api/events', (req, res) => {
  db.all('SELECT * FROM events ORDER BY date DESC', (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(rows);
  });
});

app.post('/api/events', (req, res) => {
  const { title, date, time, location, description, capacity } = req.body;
  
  db.run(
    'INSERT INTO events (title, date, time, location, description, capacity) VALUES (?, ?, ?, ?, ?, ?)',
    [title, date, time, location, description, capacity || 50],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json({ id: this.lastID, message: 'Event created successfully' });
    }
  );
});

// 404 handler
app.use((req, res) => {
  res.status(404).render('404', {
    title: '404 - Page Not Found',
    description: 'The page you are looking for does not exist.'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).render('error', {
    title: 'Server Error',
    description: 'Something went wrong.',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// Start server
const startServer = async () => {
  try {
    await initDatabase();
    
    app.listen(port, () => {
      console.log('🚀 PURE EXPRESS SERVER READY ON http://localhost:3001');
      console.log('💎 ZERO Next.js interference - Pure HTML served directly!');
      console.log('📊 SQLite database:', dbPath);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down Pure Express server...');
  if (db) {
    db.close();
  }
  process.exit(0);
});

startServer();

module.exports = app;