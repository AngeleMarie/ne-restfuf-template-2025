import Redis from 'ioredis';
import jwt from 'jsonwebtoken';

const redisClient = new Redis({
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  }
});

redisClient.on('error', (err) => {
  console.error('Redis token service error:', err);
});

/**
 * Blacklist a token by adding it to Redis.
 * @param {string} token - The JWT token to blacklist.
 * @returns {boolean} - Success status.
 */
const blacklistToken = async (token) => {
  try {
    if (!token) {
      console.error('No token provided for blacklisting');
      return false;
    }
    
    const decodedToken = jwt.decode(token);
    if (!decodedToken || !decodedToken.exp) {
      console.error('Invalid token format for blacklisting');
      return false;
    }

    const currentTime = Math.floor(Date.now() / 1000);
    const tokenExpiry = decodedToken.exp;
    const timeToExpire = tokenExpiry - currentTime;

    if (timeToExpire > 0) {
      await redisClient.set(`blacklisted_token:${token}`, 'true', 'EX', timeToExpire);
      return true;
    }

    return false;
  } catch (error) {
    console.error('Error blacklisting token:', error);
    return false;
  }
};

const generateToken = (payload, expiresIn) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });  
};
const generateRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
};
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    console.error('Token verification error:', error.message);
    return null;
  }
};

const isTokenBlacklisted = async (token) => {
  return await redisClient.exists(`blacklisted_token:${token}`);
};

export { blacklistToken, generateToken, generateRefreshToken,verifyToken, isTokenBlacklisted };
