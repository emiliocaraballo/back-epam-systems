const authService = require('../services/authService');

class AuthController {
  async register(req, res) {
    try {
      const user = await authService.createUser(req.body);
      res.status(201).json({ message: 'User registered successfully', user });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }


  async login(req, res) {
    try {
      const { username, password } = req.body;
      const user = await authService.getUserByUsername(username);

      const isValid = await authService.validatePassword(password, user.password);
      if (!isValid) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const token = authService.generateToken(user);

      res.json({
        message: 'Login successful',
        token,
        user: { id: user._id, username: user.username },
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

//   // LOGOUT
//   async logout(req, res) {
//     try {
//       // En JWT no hay "logout real" en el backend. Basta con que el frontend borre el token.
//       // Aquí devolvemos un mensaje para indicar que se cerró sesión.
//       res.json({ message: 'Logout successful. Please discard your token on client side.' });
//     } catch (error) {
//       res.status(500).json({ error: error.message });
//     }
//   }

  async getProfile(req, res) {
    try {
      const user = await authService.getUserById(req.user.id);
      res.json(user);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }
}

module.exports = new AuthController();
