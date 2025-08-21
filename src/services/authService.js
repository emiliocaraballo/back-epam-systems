const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

class AuthService {
  async getUserById(id) {
    try {
      const user = await User.findById(id).select("-password");
      if (!user) throw new Error("User not found");
      return user;
    } catch (error) {
      throw new Error("Error fetching user");
    }
  }

  async createUser(userData) {
    try {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

      const user = new User({
        ...userData,
        password: hashedPassword,
      });

      return await user.save();
    } catch (error) {
      throw new Error("Error creating user");
    }
  }

  async getUserByUsername(username) {
    try {
      const user = await User.findOne({ username });
      if (!user) {
        throw new Error("User not found");
      }
      return user;
    } catch (error) {
      if (error.message === "User not found") {
        throw error;
      }
      throw new Error(`Error fetching user: ${error.message}`);
    }
  }

  async validatePassword(inputPassword, hashedPassword) {
    return await bcrypt.compare(inputPassword, hashedPassword);
  }

  generateToken(user) {
    return jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: process.env.JWT_EXPIRES_TIME || "1h" }
    );
  }
}

module.exports = new AuthService();
