const winston = require('winston');
const path = require('path');

// Define los niveles de log y colores
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

// Define el nivel de log según el ambiente
const level = () => {
  const env = process.env.NODE_ENV || 'development';
  return env === 'development' ? 'debug' : 'warn';
};

// Asigna los colores a Winston
winston.addColors(colors);

// Define el formato del log
const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`,
  ),
);

// Define las configuraciones de transporte
const transports = [
  // Consola
  new winston.transports.Console(),
  
  // Archivo para todos los logs
  new winston.transports.File({
    filename: path.join(__dirname, '../logs/all.log'),
  }),
  
  // Archivo solo para errores
  new winston.transports.File({
    filename: path.join(__dirname, '../logs/error.log'),
    level: 'error',
  }),
];

// Crea el logger
const logger = winston.createLogger({
  level: level(),
  levels,
  format,
  transports,
});

// Middleware para Express
const loggerMiddleware = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.http(
      `${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms - ${req.ip}`
    );
  });
  
  next();
};

module.exports = {
  logger,
  loggerMiddleware
};
