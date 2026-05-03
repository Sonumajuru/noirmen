const Database = require('better-sqlite3');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const DB_PATH = process.env.DATABASE_PATH || path.join(__dirname, '..', 'noirmen.db');

let db;

function getDb() {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
  }
  return db;
}

function initDb() {
  const database = getDb();

  database.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      handle TEXT UNIQUE NOT NULL,
      thumbnail TEXT,
      collection_title TEXT,
      tags TEXT DEFAULT '[]',
      variants TEXT DEFAULT '[]',
      options TEXT DEFAULT '[]',
      images TEXT DEFAULT '[]',
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS carts (
      id TEXT PRIMARY KEY,
      customer_id TEXT,
      items TEXT DEFAULT '[]',
      completed INTEGER DEFAULT 0,
      order_id TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS customers (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      first_name TEXT,
      last_name TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      display_id INTEGER NOT NULL,
      cart_id TEXT,
      customer_id TEXT,
      email TEXT,
      status TEXT DEFAULT 'pending',
      fulfillment_status TEXT DEFAULT 'not_fulfilled',
      payment_status TEXT DEFAULT 'awaiting',
      items TEXT DEFAULT '[]',
      total INTEGER DEFAULT 0,
      subtotal INTEGER DEFAULT 0,
      shipping_total INTEGER DEFAULT 0,
      shipping_address TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS order_counter (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      next_display_id INTEGER DEFAULT 1001
    );

    INSERT OR IGNORE INTO order_counter (id, next_display_id) VALUES (1, 1001);
  `);

  seedProducts(database);
}

function nextDisplayId(database) {
  const row = database.prepare('SELECT next_display_id FROM order_counter WHERE id = 1').get();
  database.prepare('UPDATE order_counter SET next_display_id = next_display_id + 1 WHERE id = 1').run();
  return row.next_display_id;
}

function seedProducts(database) {
  const { cnt } = database.prepare('SELECT COUNT(*) as cnt FROM products').get();
  if (cnt > 0) return;

  const products = [
    {
      id: uuidv4(),
      title: 'Classic Black Tee',
      description: 'A foundational piece for any wardrobe. Cut from 100% combed cotton in a relaxed, modern fit. Minimal by design, essential by nature.',
      handle: 'classic-black-tee',
      thumbnail: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80',
      collection_title: 'Essentials',
      tags: [{ value: 'essentials' }, { value: 'tops' }],
      variants: [
        { id: uuidv4(), title: 'XS', prices: [{ amount: 4500, currency_code: 'eur' }], inventory_quantity: 10, options: [{ value: 'XS' }] },
        { id: uuidv4(), title: 'S',  prices: [{ amount: 4500, currency_code: 'eur' }], inventory_quantity: 15, options: [{ value: 'S' }] },
        { id: uuidv4(), title: 'M',  prices: [{ amount: 4500, currency_code: 'eur' }], inventory_quantity: 20, options: [{ value: 'M' }] },
        { id: uuidv4(), title: 'L',  prices: [{ amount: 4500, currency_code: 'eur' }], inventory_quantity: 18, options: [{ value: 'L' }] },
        { id: uuidv4(), title: 'XL', prices: [{ amount: 4500, currency_code: 'eur' }], inventory_quantity: 12, options: [{ value: 'XL' }] },
      ],
      options: [{ id: uuidv4(), title: 'Size', values: [{ value: 'XS' }, { value: 'S' }, { value: 'M' }, { value: 'L' }, { value: 'XL' }] }],
      images: [
        { url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80' },
        { url: 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800&q=80' },
      ],
    },
    {
      id: uuidv4(),
      title: 'Slim Chinos',
      description: 'Tailored slim chinos in a matte finish. Versatile enough for the boardroom, refined enough for the weekend. Made from stretch cotton twill.',
      handle: 'slim-chinos',
      thumbnail: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&q=80',
      collection_title: 'Essentials',
      tags: [{ value: 'essentials' }, { value: 'bottoms' }],
      variants: [
        { id: uuidv4(), title: '30', prices: [{ amount: 9500, currency_code: 'eur' }], inventory_quantity: 8,  options: [{ value: '30' }] },
        { id: uuidv4(), title: '32', prices: [{ amount: 9500, currency_code: 'eur' }], inventory_quantity: 12, options: [{ value: '32' }] },
        { id: uuidv4(), title: '34', prices: [{ amount: 9500, currency_code: 'eur' }], inventory_quantity: 10, options: [{ value: '34' }] },
        { id: uuidv4(), title: '36', prices: [{ amount: 9500, currency_code: 'eur' }], inventory_quantity: 6,  options: [{ value: '36' }] },
      ],
      options: [{ id: uuidv4(), title: 'Waist', values: [{ value: '30' }, { value: '32' }, { value: '34' }, { value: '36' }] }],
      images: [{ url: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&q=80' }],
    },
    {
      id: uuidv4(),
      title: 'Oxford Button-Down',
      description: 'A clean Oxford shirt with a firm drape and subtle texture. Classic enough to pair with tailoring, casual enough to wear untucked. 100% cotton.',
      handle: 'oxford-button-down',
      thumbnail: 'https://images.unsplash.com/photo-1598032895397-b9472444bf93?w=600&q=80',
      collection_title: 'Essentials',
      tags: [{ value: 'essentials' }, { value: 'tops' }],
      variants: [
        { id: uuidv4(), title: 'S',  prices: [{ amount: 8500, currency_code: 'eur' }], inventory_quantity: 10, options: [{ value: 'S' }] },
        { id: uuidv4(), title: 'M',  prices: [{ amount: 8500, currency_code: 'eur' }], inventory_quantity: 14, options: [{ value: 'M' }] },
        { id: uuidv4(), title: 'L',  prices: [{ amount: 8500, currency_code: 'eur' }], inventory_quantity: 12, options: [{ value: 'L' }] },
        { id: uuidv4(), title: 'XL', prices: [{ amount: 8500, currency_code: 'eur' }], inventory_quantity: 8,  options: [{ value: 'XL' }] },
      ],
      options: [{ id: uuidv4(), title: 'Size', values: [{ value: 'S' }, { value: 'M' }, { value: 'L' }, { value: 'XL' }] }],
      images: [
        { url: 'https://images.unsplash.com/photo-1598032895397-b9472444bf93?w=800&q=80' },
        { url: 'https://images.unsplash.com/photo-1604644401890-0bd678c83788?w=800&q=80' },
      ],
    },
    {
      id: uuidv4(),
      title: 'Merino Crew Neck',
      description: 'A lightweight merino wool sweater with a fine knit construction. Naturally temperature-regulating and buttery soft against the skin.',
      handle: 'merino-crew-neck',
      thumbnail: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&q=80',
      collection_title: 'Essentials',
      tags: [{ value: 'essentials' }, { value: 'knitwear' }],
      variants: [
        { id: uuidv4(), title: 'S',  prices: [{ amount: 12000, currency_code: 'eur' }], inventory_quantity: 8,  options: [{ value: 'S' }] },
        { id: uuidv4(), title: 'M',  prices: [{ amount: 12000, currency_code: 'eur' }], inventory_quantity: 10, options: [{ value: 'M' }] },
        { id: uuidv4(), title: 'L',  prices: [{ amount: 12000, currency_code: 'eur' }], inventory_quantity: 9,  options: [{ value: 'L' }] },
        { id: uuidv4(), title: 'XL', prices: [{ amount: 12000, currency_code: 'eur' }], inventory_quantity: 5,  options: [{ value: 'XL' }] },
      ],
      options: [{ id: uuidv4(), title: 'Size', values: [{ value: 'S' }, { value: 'M' }, { value: 'L' }, { value: 'XL' }] }],
      images: [{ url: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=80' }],
    },
    {
      id: uuidv4(),
      title: 'Slim Black Jeans',
      description: 'Clean-cut black denim with minimal branding. Faded mid-rise construction with a slim leg. A wardrobe anchor that earns its keep.',
      handle: 'slim-black-jeans',
      thumbnail: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&q=80',
      collection_title: 'Streetwear',
      tags: [{ value: 'streetwear' }, { value: 'bottoms' }, { value: 'denim' }],
      variants: [
        { id: uuidv4(), title: '30', prices: [{ amount: 11000, currency_code: 'eur' }], inventory_quantity: 7,  options: [{ value: '30' }] },
        { id: uuidv4(), title: '32', prices: [{ amount: 11000, currency_code: 'eur' }], inventory_quantity: 11, options: [{ value: '32' }] },
        { id: uuidv4(), title: '34', prices: [{ amount: 11000, currency_code: 'eur' }], inventory_quantity: 9,  options: [{ value: '34' }] },
        { id: uuidv4(), title: '36', prices: [{ amount: 11000, currency_code: 'eur' }], inventory_quantity: 4,  options: [{ value: '36' }] },
      ],
      options: [{ id: uuidv4(), title: 'Waist', values: [{ value: '30' }, { value: '32' }, { value: '34' }, { value: '36' }] }],
      images: [{ url: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&q=80' }],
    },
    {
      id: uuidv4(),
      title: 'Leather Dress Belt',
      description: 'Full-grain leather belt with a minimal silver-tone buckle. Resolves with quiet authority. Built to last, designed to disappear.',
      handle: 'leather-dress-belt',
      thumbnail: 'https://images.unsplash.com/photo-1624222247344-550fb60fe8ff?w=600&q=80',
      collection_title: 'Accessories',
      tags: [{ value: 'accessories' }, { value: 'leather' }],
      variants: [
        { id: uuidv4(), title: '32"', prices: [{ amount: 5500, currency_code: 'eur' }], inventory_quantity: 8,  options: [{ value: '32"' }] },
        { id: uuidv4(), title: '34"', prices: [{ amount: 5500, currency_code: 'eur' }], inventory_quantity: 10, options: [{ value: '34"' }] },
        { id: uuidv4(), title: '36"', prices: [{ amount: 5500, currency_code: 'eur' }], inventory_quantity: 6,  options: [{ value: '36"' }] },
        { id: uuidv4(), title: '38"', prices: [{ amount: 5500, currency_code: 'eur' }], inventory_quantity: 4,  options: [{ value: '38"' }] },
      ],
      options: [{ id: uuidv4(), title: 'Size', values: [{ value: '32"' }, { value: '34"' }, { value: '36"' }, { value: '38"' }] }],
      images: [{ url: 'https://images.unsplash.com/photo-1624222247344-550fb60fe8ff?w=800&q=80' }],
    },
    {
      id: uuidv4(),
      title: 'Technical Track Jacket',
      description: 'Water-resistant shell jacket in a slim athletic silhouette. Minimalist tape details and concealed zipper pockets. For urban movement.',
      handle: 'technical-track-jacket',
      thumbnail: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&q=80',
      collection_title: 'Streetwear',
      tags: [{ value: 'streetwear' }, { value: 'outerwear' }],
      variants: [
        { id: uuidv4(), title: 'S',  prices: [{ amount: 15000, currency_code: 'eur' }], inventory_quantity: 6, options: [{ value: 'S' }] },
        { id: uuidv4(), title: 'M',  prices: [{ amount: 15000, currency_code: 'eur' }], inventory_quantity: 9, options: [{ value: 'M' }] },
        { id: uuidv4(), title: 'L',  prices: [{ amount: 15000, currency_code: 'eur' }], inventory_quantity: 7, options: [{ value: 'L' }] },
        { id: uuidv4(), title: 'XL', prices: [{ amount: 15000, currency_code: 'eur' }], inventory_quantity: 5, options: [{ value: 'XL' }] },
      ],
      options: [{ id: uuidv4(), title: 'Size', values: [{ value: 'S' }, { value: 'M' }, { value: 'L' }, { value: 'XL' }] }],
      images: [{ url: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80' }],
    },
    {
      id: uuidv4(),
      title: 'Canvas Weekender',
      description: 'Heavy canvas weekender in waxed cotton with vegetable-tanned leather straps. Minimal exterior design, functional interior.',
      handle: 'canvas-weekender',
      thumbnail: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80',
      collection_title: 'Accessories',
      tags: [{ value: 'accessories' }, { value: 'bags' }],
      variants: [
        { id: uuidv4(), title: 'One Size', prices: [{ amount: 18500, currency_code: 'eur' }], inventory_quantity: 5, options: [{ value: 'One Size' }] },
      ],
      options: [{ id: uuidv4(), title: 'Size', values: [{ value: 'One Size' }] }],
      images: [{ url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80' }],
    },
  ];

  const insert = database.prepare(`
    INSERT INTO products (id, title, description, handle, thumbnail, collection_title, tags, variants, options, images)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertMany = database.transaction((rows) => {
    for (const p of rows) {
      insert.run(
        p.id, p.title, p.description, p.handle, p.thumbnail, p.collection_title,
        JSON.stringify(p.tags), JSON.stringify(p.variants),
        JSON.stringify(p.options), JSON.stringify(p.images)
      );
    }
  });

  insertMany(products);
  console.log(`Seeded ${products.length} products`);
}

function formatProduct(row) {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    handle: row.handle,
    thumbnail: row.thumbnail,
    collection: row.collection_title ? { title: row.collection_title } : null,
    tags: JSON.parse(row.tags || '[]'),
    variants: JSON.parse(row.variants || '[]'),
    options: JSON.parse(row.options || '[]'),
    images: JSON.parse(row.images || '[]'),
  };
}

module.exports = { getDb, initDb, nextDisplayId, formatProduct };
