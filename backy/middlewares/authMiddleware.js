import Redis from 'ioredis';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// Redis client with reconnect strategy
const redisClient = new Redis({
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);  // Exponential backoff for Redis reconnections
    return delay;
  }
});

redisClient.on('error', (err) => {
  console.error('Redis connection error:', err);
});

const authentication = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];

  
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Invalid or missing authorization header' });
    }

    const token = authHeader.split(' ')[1];

    if (!token || token === 'null' || token === 'undefined') {
      return res.status(401).json({ error: 'Invalid token format' });
    }

    const isBlacklisted = await redisClient.get(`blacklisted_token:${token}`);
    if (isBlacklisted) {
      return res.status(401).json({ error: 'Token has been revoked. Please log in again.' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          return res.status(401).json({ error: 'Token has expired. Please log in again.' });
        }
        return res.status(403).json({ error: 'Invalid token. Please log in again.' });
      }
      req.user = decodedToken;
      req.token = token; 
      next();
    });
  } catch (error) {
    console.error('Error in authentication and blacklist check middleware:', error);
    res.status(500).json({ error: 'An error occurred during authentication' });
  }
};

export default authentication;
