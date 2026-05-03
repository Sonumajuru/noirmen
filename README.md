# NOIRMEN

Modern essentials for men. A full-stack e-commerce storefront with a minimalist noir aesthetic.

## Stack

| Layer | Tech |
|---|---|
| Frontend | Next.js 14 (App Router), TypeScript, Tailwind CSS |
| Backend | Express.js, Node.js |
| Database | SQLite (via `better-sqlite3`) |
| Auth | JWT stored in HTTP-only cookies |

No external services required — the database is a local SQLite file created automatically on first run.

---

## Project Structure

```
noirmen/
├── backend/        # Express.js API (port 9000)
└── storefront/     # Next.js storefront (port 3000)
```

---

## Getting Started

### 1. Backend

```bash
cd backend
npm install
npm run dev
```

The API starts on **http://localhost:9000**. The SQLite database (`noirmen.db`) and seed data (8 products) are created automatically on first boot.

### 2. Storefront

In a separate terminal:

```bash
cd storefront
npm install
npm run dev
```

Open **http://localhost:3000**.

---

## Environment Variables

### Backend (`backend/.env`)

Copy from the example and adjust as needed:

```bash
cp backend/.env.example backend/.env
```

| Variable | Default | Description |
|---|---|---|
| `PORT` | `9000` | Port the API listens on |
| `JWT_SECRET` | `noirmen_dev_secret` | Secret used to sign auth tokens — **change in production** |
| `STORE_CORS` | `http://localhost:3000` | Allowed origin for CORS |
| `DATABASE_PATH` | `./noirmen.db` | Path to the SQLite database file |
| `NODE_ENV` | `development` | `development` or `production` |

### Storefront (`storefront/.env.local`)

```bash
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000
```

---

## API Endpoints

All endpoints are prefixed with `/store`.

### Products
| Method | Path | Description |
|---|---|---|
| `GET` | `/store/products` | List products (supports `?q=`, `?collection_title=`, `?limit=`, `?offset=`) |
| `GET` | `/store/products/:id` | Get a single product by ID or handle |

### Cart
| Method | Path | Description |
|---|---|---|
| `POST` | `/store/carts` | Create a new cart |
| `GET` | `/store/carts/:id` | Retrieve a cart |
| `POST` | `/store/carts/:id/line-items` | Add an item (`{ variant_id, quantity }`) |
| `POST` | `/store/carts/:id/line-items/:lineId` | Update item quantity (`{ quantity }`) |
| `DELETE` | `/store/carts/:id/line-items/:lineId` | Remove an item |
| `POST` | `/store/carts/:id/complete` | Complete cart and create an order |

### Auth
| Method | Path | Description |
|---|---|---|
| `POST` | `/store/auth` | Login (`{ email, password }`) |
| `DELETE` | `/store/auth` | Logout |

### Customers
| Method | Path | Description |
|---|---|---|
| `POST` | `/store/customers` | Register (`{ email, password, first_name, last_name }`) |
| `GET` | `/store/customers/me` | Get current customer (requires auth) |
| `GET` | `/store/customers/me/orders` | List customer's orders (requires auth) |

### Orders
| Method | Path | Description |
|---|---|---|
| `GET` | `/store/orders/cart/:cartId` | Get order by cart ID |
| `GET` | `/store/orders?display_id=X&email=Y` | Look up order by display ID and email |

---

## Available Scripts

### Backend

```bash
npm run dev     # Start with nodemon (auto-reloads on file changes)
npm run start   # Start without auto-reload (production)
npm run build   # No-op (no build step needed)
```

### Storefront

```bash
npm run dev     # Start development server with hot reload
npm run build   # Build for production
npm run start   # Start production server (run build first)
npm run lint    # Run ESLint
```

---

## Resetting the Database

To wipe all data and re-seed products from scratch, delete the database file and restart the backend:

```bash
rm backend/noirmen.db
cd backend && npm run dev
```

---

## Production Notes

- Set a strong `JWT_SECRET` in `backend/.env`
- Set `NODE_ENV=production` to enable secure cookies
- The SQLite database file should be persisted and backed up
- Update `STORE_CORS` to your production frontend domain
