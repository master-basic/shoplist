const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'grocerymind-dev-secret-change-in-production';

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Authentication required' });
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: 'Invalid or expired token' });
    req.user = decoded;
    next();
  });
}

function generateToken(user) {
  return jwt.sign({ id: user.id, email: user.email, name: user.name, is_admin: user.is_admin }, JWT_SECRET, { expiresIn: '7d' });
}

module.exports = { authenticateToken, generateToken };
