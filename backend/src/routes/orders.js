const { Router } = require('express');
const { getDb } = require('../db');

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

// GET /store/orders/cart/:cartId
router.get('/cart/:cartId', (req, res) => {
  const db = getDb();
  const order = db.prepare('SELECT * FROM orders WHERE cart_id = ?').get(req.params.cartId);
  if (!order) return res.status(404).json({ message: 'Order not found' });
  res.json({ order: formatOrder(order) });
});

// GET /store/orders?display_id=X&email=Y
router.get('/', (req, res) => {
  const { display_id, email } = req.query;
  if (!display_id || !email) return res.status(400).json({ message: 'display_id and email are required' });

  const db = getDb();
  const order = db
    .prepare('SELECT * FROM orders WHERE display_id = ? AND LOWER(email) = LOWER(?)')
    .get(parseInt(display_id), email);

  if (!order) return res.status(404).json({ message: 'Order not found' });
  res.json({ order: formatOrder(order) });
});

module.exports = router;
