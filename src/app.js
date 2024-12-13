const express = require('express');
const { connectDB } = require('./config/db');
const eventRoutes = require('./routes/eventRoutes');
const errorHandler = require('./utils/errorHandler');
const rateLimit = require('express-rate-limit');

const app = express();

// Configure rate limiter
const apiLimiter = rateLimit({
  windowMs: process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000, // 15 minutes
  max: process.env.RATE_LIMIT_MAX || 100, // Max requests per window
  message: 'Too many requests from this IP, please try again later.',
});


app.use('/api', apiLimiter);

app.use(express.json());

app.use('/api/events', eventRoutes);

app._router.stack.forEach((middleware) => {
  if (middleware.route) {
    console.log(`Registered route: ${middleware.route.path}`);
  }
});


app.use(errorHandler);


const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to the database:', err);
    process.exit(1); 
  });

module.exports = app;
