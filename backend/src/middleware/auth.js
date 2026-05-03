const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'noirmen_dev_secret';

function authMiddleware(req, _res, next) {
  const token = req.cookies?.noirmen_token;
  if (!token) {
    req.customerId = null;
    return next();
  }
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.customerId = payload.customerId;
  } catch {
    req.customerId = null;
  }
  next();
}

function requireAuth(req, res, next) {
  if (!req.customerId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  next();
}

function createToken(customerId) {
  return jwt.sign({ customerId }, JWT_SECRET, { expiresIn: '7d' });
}

const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000,
  secure: process.env.NODE_ENV === 'production',
};

module.exports = { authMiddleware, requireAuth, createToken, COOKIE_OPTIONS };
