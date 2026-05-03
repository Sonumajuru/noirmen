const { Router } = require('express');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const { getDb } = require('../db');
const { requireAuth, createToken, COOKIE_OPTIONS } = require('../middleware/auth');

const router = Router();

function formatOrder(row) {
  return {
    id: row.id,
    display_id: row.display_id,
    status: row.status,
    fulfillment_status: row.fulfillment_status,
    payment_status: row.payment_status,
    email: row.email,
    created_at: row.created_at,
    items: JSON.parse(row.items || '[]'),
    total: row.total,
    subtotal: row.subtotal,
    shipping_total: row.shipping_total,
    shipping_address: row.shipping_address ? JSON.parse(row.shipping_address) : null,
  };
}

// POST /store/customers — register
router.post('/', async (req, res) => {
  const { email, password, first_name, last_name } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

  const db = getDb();
  const existing = db.prepare('SELECT id FROM customers WHERE email = ?').get(email);
  if (existing) return res.status(409).json({ message: 'An account with that email already exists' });

  const id = uuidv4();
  const password_hash = await bcrypt.hash(password, 10);
  db.prepare('INSERT INTO customers (id, email, password_hash, first_name, last_name) VALUES (?, ?, ?, ?, ?)')
    .run(id, email, password_hash, first_name || '', last_name || '');

  res.cookie('noirmen_token', createToken(id), COOKIE_OPTIONS);
  res.status(201).json({ customer: { id, email, first_name: first_name || '', last_name: last_name || '' } });
});

// GET /store/customers/me
router.get('/me', requireAuth, (req, res) => {
  const db = getDb();
  const customer = db
    .prepare('SELECT id, email, first_name, last_name FROM customers WHERE id = ?')
    .get(req.customerId);
  if (!customer) return res.status(404).json({ message: 'Customer not found' });
  res.json({ customer });
});

// GET /store/customers/me/orders
router.get('/me/orders', requireAuth, (req, res) => {
  const db = getDb();
  const orders = db
    .prepare('SELECT * FROM orders WHERE customer_id = ? ORDER BY created_at DESC')
    .all(req.customerId);
  res.json({ orders: orders.map(formatOrder) });
});

module.exports = router;
