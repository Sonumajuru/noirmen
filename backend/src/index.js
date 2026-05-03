require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { initDb } = require('./db');
const { authMiddleware } = require('./middleware/auth');
const productsRouter = require('./routes/products');
const cartsRouter = require('./routes/carts');
const customersRouter = require('./routes/customers');
const authRouter = require('./routes/auth');
const ordersRouter = require('./routes/orders');

const app = express();
const PORT = process.env.PORT || 9000;

const allowedOrigins = (process.env.STORE_CORS || 'http://localhost:3000')
  .split(',')
  .map((s) => s.trim());

app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(authMiddleware);

app.use('/store/products', productsRouter);
app.use('/store/carts', cartsRouter);
app.use('/store/customers', customersRouter);
app.use('/store/auth', authRouter);
app.use('/store/orders', ordersRouter);

app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'noirmen-backend' }));

initDb();

app.listen(PORT, () => {
  console.log(`NOIRMEN Express backend running on http://localhost:${PORT}`);
});
