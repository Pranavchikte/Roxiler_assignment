const { User } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const generateToken = (user) => {
  return jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });
};

const register = async (req, res) => {
  try {
    const { name, email, password, address } = req.body;

    const userExists = await User.findOne({ where: { email } });
    if (userExists)
      return res.status(400).json({ error: "Email already registered" });

    const user = await User.create({
      name,
      email,
      password,
      address,
      role: "NORMAL_USER", 
    });

    res
      .status(201)
      .json({ message: "User registered successfully", userId: user.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user)
      return res.status(400).json({ error: "Invalid Email or Password" });

    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass)
      return res.status(400).json({ error: "Invalid Email or Password" });

    const token = generateToken(user);

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { register, login };
