const User = require("../models/User");
const LoginAttempt = require("../models/LoginAttemps");
const bcrypt = require("bcrypt");
const checkBruteForce = require("../middlewares/bruteForceProtection");

exports.login = async (req, res) => {
 const { email, password } = req.body;
  const ip = req.ip;
  try {
    const blockStatus = await checkBruteForce(email, ip);
    if (blockStatus.blocked) {
      return res.status(429).json({ message: blockStatus.reason });
    }
    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      await LoginAttempt.create({
        email,
        ip,
        success: false,
        timestamp: new Date(),
      });
      return res.status(401).json({ message: "Invalid email or password" });
    }
    await LoginAttempt.create({
      email,
      ip,
      success: true,
      timestamp: new Date(),
    });
    return res.status(200).json({ message: "Login successful" });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


exports.signup = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword
    });
    await newUser.save();
    return res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};
