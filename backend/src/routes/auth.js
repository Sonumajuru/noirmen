const { Router } = require('express');
const bcrypt = require('bcrypt');
const { getDb } = require('../db');
const { createToken, COOKIE_OPTIONS } = require('../middleware/auth');

const router = Router();

// POST /store/auth — login
router.post('/', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

  const db = getDb();
  const customer = db.prepare('SELECT * FROM customers WHERE email = ?').get(email);
  if (!customer) return res.status(401).json({ message: 'Invalid credentials' });

  const valid = await bcrypt.compare(password, customer.password_hash);
  if (!valid) return res.status(401).json({ message: 'Invalid credentials' });

  res.cookie('noirmen_token', createToken(customer.id), COOKIE_OPTIONS);
  res.json({
    customer: {
      id: customer.id,
      email: customer.email,
      first_name: customer.first_name,
      last_name: customer.last_name,
    },
  });
});

// DELETE /store/auth — logout
router.delete('/', (_req, res) => {
  res.clearCookie('noirmen_token');
  res.json({ success: true });
});

module.exports = router;
