const { Router } = require('express');
const { getDb, formatProduct } = require('../db');

const router = Router();

router.get('/', (req, res) => {
  const db = getDb();
  const { limit = '20', offset = '0', collection_title, handle, q } = req.query;

  const conditions = [];
  const params = [];

  if (collection_title) {
    conditions.push('collection_title = ?');
    params.push(collection_title);
  }
  if (handle) {
    conditions.push('handle = ?');
    params.push(handle);
  }
  if (q) {
    conditions.push('(title LIKE ? OR description LIKE ?)');
    params.push(`%${q}%`, `%${q}%`);
  }

  const where = conditions.length ? ' WHERE ' + conditions.join(' AND ') : '';

  const { cnt } = db.prepare(`SELECT COUNT(*) as cnt FROM products${where}`).get(...params);
  const rows = db
    .prepare(`SELECT * FROM products${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`)
    .all(...params, parseInt(limit), parseInt(offset));

  res.json({
    products: rows.map(formatProduct),
    count: cnt,
    offset: parseInt(offset),
    limit: parseInt(limit),
  });
});

router.get('/:id', (req, res) => {
  const db = getDb();
  const row = db
    .prepare('SELECT * FROM products WHERE id = ? OR handle = ?')
    .get(req.params.id, req.params.id);

  if (!row) return res.status(404).json({ message: 'Product not found' });
  res.json({ product: formatProduct(row) });
});

module.exports = router;
