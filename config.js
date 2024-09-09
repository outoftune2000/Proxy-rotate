module.exports = {
  port: process.env.PORT || 3128,
  host: process.env.HOST || '0.0.0.0',
  // Database configuration
  database: {
    url: process.env.DATABASE_URL || 'mongodb://localhost:27017/myapp',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  // JWT secret for authentication
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
  // API rate limiting
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  },
  // Logging configuration
  logging: {
    level: process.env.LOG_LEVEL || 'info',
  },
  // CORS configuration
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  },
};
