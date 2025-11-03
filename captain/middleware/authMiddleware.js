const jwt = require('jsonwebtoken')
require('dotenv').config()

const JWT_SECRET = process.env.JWT_SECRET

// Middleware to verify JWT token
module.exports = (req, res, next) => {
  const token = req.cookies.token

  if (!token) {
    return res.status(401).send('Unauthorized: No token found')
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    req.user = decoded // attach user info to request
    next() // continue to the next handler (e.g. controller)
  } catch (error) {
    res.status(401).send('Invalid or expired token')
  }
}
    