const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');


router.post('/register', (req, res) => authController.register(req, res));
router.post('/login', (req, res) => authController.login(req, res));
// router.post('/logout', (req, res) => authController.logout(req, res));
router.get('/profile', authMiddleware, (req, res) => authController.getProfile(req, res));

module.exports = router;
