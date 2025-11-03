const captainModel = require('../models/captain.models.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const { subscribeToQueue } = require('../service/rabbit')

const JWT_SECRET = process.env.JWT_SECRET;

// ---------------- Register Captain ----------------
module.exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await captainModel.findOne({ email });
    if (existingUser) {
      return res.status(400).send('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await captainModel.create({
      name,
      email,
      password: hashedPassword
    });

    const token = jwt.sign({ id: newUser._id, email: newUser.email }, JWT_SECRET, {
      expiresIn: '1h'
    });

    res.cookie('token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: 3600000
    });

    res.status(201).send({
      message: 'User registered successfully',
      user: newUser
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// ---------------- Login Captain ----------------
module.exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await captainModel.findOne({ email });
    if (!user) {
      return res.status(400).send('User not found');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).send('Invalid password');
    }

    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
      expiresIn: '1h'
    });

    res.cookie('token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: 3600000
    });

    res.status(200).send({
      message: 'Login successful',
      user
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// ---------------- Profile (Protected Route) ----------------
module.exports.getProfile = async (req, res) => {
  try {
    const user = await captainModel.findById(req.user.id).select('-password');
    if (!user) return res.status(404).send('User not found');

    res.status(200).send({
      message: 'User profile fetched successfully',
      user
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// ---------------- Logout ----------------
module.exports.logoutUser = async (req, res) => {
  try {
    res.clearCookie('token');
    res.status(200).send({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// ---------------- Toggle Availability ----------------
module.exports.toggleAvailability = async (req, res) => {
  try {
    const captain = await captainModel.findById(req.user.id); // ✅ use req.user.id (middleware sets this)
    if (!captain) return res.status(404).send('Captain not found');

    captain.isAvailable = !captain.isAvailable;
    await captain.save();

    res.status(200).send({
      message: 'Availability updated successfully',
      isAvailable: captain.isAvailable
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


subscribeToQueue("new-ride", (data) => {
  console.log(data);
});