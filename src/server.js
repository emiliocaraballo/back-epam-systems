const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const config = require('./config/configenv.js');
const { logger, loggerMiddleware } = require('./utils/logger');
const PORT = config.port || 3000;

const booksRouter = require('./routes/bookRoutes');
const authRouter = require('./routes/authRoutes');



mongoose.connect(process.env.MONGODB_URI || 'mongodb://admin:password123@localhost:27017/book-reviews?authSource=admin')
  .then(() => logger.info('Connected to MongoDB'))
  .catch((err) => logger.error('MongoDB connection error:', err));

const app = express();

app.use(cors({ origin: config.corsOrigin }));
app.use(loggerMiddleware);  // Añadir el middleware de logging
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));


app.get('/', (req, res) => {
  res.send('🚀 API Books is running');
});

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/books', booksRouter);


app.use((req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
});


app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

app.listen(PORT, () => {
  logger.info(`[API] http://localhost:${PORT}`);
});
