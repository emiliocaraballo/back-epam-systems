const jwt = require("jsonwebtoken");
const AuthService = require("../services/authService");
const { logger } = require("../utils/logger");

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];

    if (!authHeader) {
      logger.warn("Authorization attempt without header");
      return res.status(401).json({ message: "Authorization header missing" });
    }

    // Formato: "Bearer token"
    const token = authHeader.split(" ")[1];
    if (!token) {
      logger.warn("Authorization attempt without token");
      return res.status(401).json({ message: "Token missing" });
    }

    // Verificar token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-256-bit-secret"
    );

    // Verificar expiración
    const now = Math.floor(Date.now() / 1000);
    if (decoded.exp && decoded.exp < now) {
      logger.warn(`Token expired for user ${decoded.id}`);
      return res.status(401).json({ message: "Token has expired" });
    }

    // Buscar usuario en DB para asegurarnos que existe
    const user = await AuthService.getUserById(decoded.id);
    if (!user) {
      logger.warn(`User not found for token: ${decoded.id}`);
      return res.status(401).json({ message: "User not found" });
    }

    logger.debug(`User authenticated successfully: ${user.id}`);
    // Guardar usuario en la request
    req.user = user;
    next();
  } catch (error) {
    logger.error(`Authentication error: ${error.message}`);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: "Invalid token" });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: "Token has expired" });
    }
    return res.status(403).json({ message: "Authentication failed" });
  }
};

module.exports = authMiddleware;
