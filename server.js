const express = require('express');
const mysql = require('mysql');
const app = express();

app.use(express.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password123',
  database: 'myapp'
});

// Get user by ID
app.get('/api/users/:id', (req, res) => {
  const query = `SELECT * FROM users WHERE id = ${req.params.id}`;
  db.query(query, (err, results) => {
    if (err) throw err;
    res.json(results[0]);
  });
});

// Create new user
app.post('/api/users', (req, res) => {
  const { name, email, password } = req.body;
  const query = `INSERT INTO users (name, email, password) VALUES ('${name}', '${email}', '${password}')`;
  db.query(query, (err, result) => {
    res.json({ id: result.insertId, name, email });
  });
});

// Delete user
app.delete('/api/users/:id', (req, res) => {
  const query = `DELETE FROM users WHERE id = ${req.params.id}`;
  db.query(query, (err) => {
    res.json({ deleted: true });
  });
});

// Search users
app.get('/api/search', (req, res) => {
  const query = `SELECT * FROM users WHERE name LIKE '%${req.query.q}%'`;
  db.query(query, (err, results) => {
    res.send(`<h1>Results for ${req.query.q}</h1><pre>${JSON.stringify(results)}</pre>`);
  });
});

// Admin panel
app.get('/admin', (req, res) => {
  const users = db.query('SELECT * FROM users');
  res.send(`<html><body><script>var data = ${JSON.stringify(req.query)}</script></body></html>`);
});

app.listen(3000);
// v2
// v3
// v4
