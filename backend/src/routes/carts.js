const { Router } = require('express');
const { v4: uuidv4 } = require('uuid');
const { getDb, nextDisplayId } = require('../db');

const router = Router();

function findVariant(db, variantId) {
  const products = db.prepare('SELECT * FROM products').all();
  for (const p of products) {
    const variants = JSON.parse(p.variants || '[]');
    const variant = variants.find((v) => v.id === variantId);
    if (variant) return { product: p, variant };
  }
  return null;
}

function buildCart(cartRow, db) {
  const rawItems = JSON.parse(cartRow.items || '[]');
  const lineItems = [];
  let subtotal = 0;

  for (const item of rawItems) {
    const found = findVariant(db, item.variant_id);
    if (!found) continue;

    const { product, variant } = found;
    const price = variant.prices[0]?.amount || 0;
    const itemSubtotal = price * item.quantity;
    subtotal += itemSubtotal;

    lineItems.push({
      id: item.id,
      title: product.title,
      quantity: item.quantity,
      thumbnail: product.thumbnail,
      variant,
      unit_price: price,
      subtotal: itemSubtotal,
    });
  }

  const shipping_total = lineItems.length > 0 ? 500 : 0;
  const tax_total = Math.round(subtotal * 0.21);
  const total = subtotal + shipping_total + tax_total;

  return {
    id: cartRow.id,
    items: lineItems,
    subtotal,
    shipping_total,
    tax_total,
    total,
    region: { currency_code: 'eur' },
  };
}

// POST /store/carts
router.post('/', (req, res) => {
  const db = getDb();
  const id = uuidv4();
  db.prepare('INSERT INTO carts (id, items) VALUES (?, ?)').run(id, '[]');
  const cartRow = db.prepare('SELECT * FROM carts WHERE id = ?').get(id);
  res.status(201).json({ cart: buildCart(cartRow, db) });
});

// GET /store/carts/:id
router.get('/:id', (req, res) => {
  const db = getDb();
  const cartRow = db.prepare('SELECT * FROM carts WHERE id = ?').get(req.params.id);
  if (!cartRow) return res.status(404).json({ message: 'Cart not found' });
  if (cartRow.completed) return res.status(400).json({ message: 'Cart already completed' });
  res.json({ cart: buildCart(cartRow, db) });
});

// POST /store/carts/:id/line-items — add item
router.post('/:id/line-items', (req, res) => {
  const db = getDb();
  const { variant_id, quantity = 1 } = req.body;

  if (!variant_id) return res.status(400).json({ message: 'variant_id is required' });

  const cartRow = db.prepare('SELECT * FROM carts WHERE id = ?').get(req.params.id);
  if (!cartRow) return res.status(404).json({ message: 'Cart not found' });

  const items = JSON.parse(cartRow.items || '[]');
  const existing = items.find((i) => i.variant_id === variant_id);

  if (existing) {
    existing.quantity += quantity;
  } else {
    items.push({ id: uuidv4(), variant_id, quantity });
  }

  db.prepare('UPDATE carts SET items = ? WHERE id = ?').run(JSON.stringify(items), req.params.id);
  const updated = db.prepare('SELECT * FROM carts WHERE id = ?').get(req.params.id);
  res.json({ cart: buildCart(updated, db) });
});

// POST /store/carts/:id/line-items/:lineId — update quantity
router.post('/:id/line-items/:lineId', (req, res) => {
  const db = getDb();
  const { quantity } = req.body;

  const cartRow = db.prepare('SELECT * FROM carts WHERE id = ?').get(req.params.id);
  if (!cartRow) return res.status(404).json({ message: 'Cart not found' });

  let items = JSON.parse(cartRow.items || '[]');

  if (quantity <= 0) {
    items = items.filter((i) => i.id !== req.params.lineId);
  } else {
    const item = items.find((i) => i.id === req.params.lineId);
    if (item) item.quantity = quantity;
  }

  db.prepare('UPDATE carts SET items = ? WHERE id = ?').run(JSON.stringify(items), req.params.id);
  const updated = db.prepare('SELECT * FROM carts WHERE id = ?').get(req.params.id);
  res.json({ cart: buildCart(updated, db) });
});

// DELETE /store/carts/:id/line-items/:lineId
router.delete('/:id/line-items/:lineId', (req, res) => {
  const db = getDb();
  const cartRow = db.prepare('SELECT * FROM carts WHERE id = ?').get(req.params.id);
  if (!cartRow) return res.status(404).json({ message: 'Cart not found' });

  const items = JSON.parse(cartRow.items || '[]').filter((i) => i.id !== req.params.lineId);
  db.prepare('UPDATE carts SET items = ? WHERE id = ?').run(JSON.stringify(items), req.params.id);
  const updated = db.prepare('SELECT * FROM carts WHERE id = ?').get(req.params.id);
  res.json({ cart: buildCart(updated, db) });
});

// POST /store/carts/:id/complete
router.post('/:id/complete', (req, res) => {
  const db = getDb();
  const cartRow = db.prepare('SELECT * FROM carts WHERE id = ?').get(req.params.id);
  if (!cartRow) return res.status(404).json({ message: 'Cart not found' });
  if (cartRow.completed) return res.status(400).json({ message: 'Cart already completed' });

  const cartData = buildCart(cartRow, db);
  if (cartData.items.length === 0) return res.status(400).json({ message: 'Cart is empty' });

  const customer = cartRow.customer_id
    ? db.prepare('SELECT * FROM customers WHERE id = ?').get(cartRow.customer_id)
    : null;

  const orderId = uuidv4();
  const displayId = nextDisplayId(db);
  const email = customer?.email || 'guest@noirmen.com';

  const orderItems = cartData.items.map((item) => ({
    id: item.id,
    title: item.title,
    quantity: item.quantity,
    thumbnail: item.thumbnail,
    unit_price: item.unit_price,
    subtotal: item.subtotal,
  }));

  db.prepare(`
    INSERT INTO orders
      (id, display_id, cart_id, customer_id, email, status, fulfillment_status, payment_status,
       items, total, subtotal, shipping_total)
    VALUES (?, ?, ?, ?, ?, 'pending', 'not_fulfilled', 'awaiting', ?, ?, ?, ?)
  `).run(
    orderId, displayId, req.params.id, cartRow.customer_id || null, email,
    JSON.stringify(orderItems), cartData.total, cartData.subtotal, cartData.shipping_total
  );

  db.prepare('UPDATE carts SET completed = 1, order_id = ? WHERE id = ?').run(orderId, req.params.id);

  const orderRow = db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId);

  res.json({
    type: 'order',
    data: {
      id: orderRow.id,
      display_id: orderRow.display_id,
      status: orderRow.status,
      fulfillment_status: orderRow.fulfillment_status,
      payment_status: orderRow.payment_status,
      email: orderRow.email,
      created_at: orderRow.created_at,
      items: JSON.parse(orderRow.items),
      total: orderRow.total,
      subtotal: orderRow.subtotal,
      shipping_total: orderRow.shipping_total,
      shipping_address: null,
    },
  });
});

module.exports = router;
