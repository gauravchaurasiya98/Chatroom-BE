const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const auth = require("../utils/authentication");
const User = require("../models/User");

exports.register = async (req, res) => {
  try {
    let { fullName, email, password } = req.body;
    fullName = fullName?.trim();
    email = email?.trim();
    password = password?.trim();
    if (!fullName || !email || !password) {
      return res.status(400).json({
        message: "Full Name, Email, and Password are required.",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ fullName, email, password: hashedPassword });
    await user.save();
    const userInfo = { id: user._id, fullName: user.fullName };
    generateRefreshToken(userInfo, res);
    const authToken = generateAndGetAuthToken(userInfo);
    res.status(201).json({
      user: userInfo,
      authToken,
      message: "User registered successfully",
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error registering user", error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    let { email, password } = req.body;
    email = email?.trim();
    password = password?.trim();
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const userInfo = { id: user._id, fullName: user.fullName };
    generateRefreshToken(userInfo, res);
    const authToken = generateAndGetAuthToken(userInfo);
    res.json({ user: userInfo, authToken, message: "Logged in successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error during login", error: error.message });
  }
};

exports.refreshToken = (req, res) => {
  try {
    generateRefreshToken(req.user, res);
    const authToken = generateAndGetAuthToken(req.user);
    res.json({
      user: req.user,
      authToken,
      message: "Token refreshed successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error while generating new token",
      error: error.message,
    });
  }
};

exports.logout = (req, res) => {
  try {
    res.clearCookie("authToken", {
      httpOnly: false,
      secure: true,
      sameSite: "None",
    });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error while clearing cookies", error: error.message });
  }
};

const generateRefreshToken = (userInfo, res) => {
  try {
    const refreshToken = jwt.sign(userInfo, auth.getRefreshTokenPrivateKey(), {
      algorithm: "RS256",
      expiresIn: "1h",
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true, // If true then prevents client-side JavaScript from accessing the cookie
      secure: true, // If true then send over only HTTPS
      sameSite: "None", // Allow cross-origin cookies
      maxAge: 60 * 60 * 1000, // Cookie expiration time (1 hour)
    });
  } catch (error) {
    throw new Error(`Error while generating refreshToken: ${error.message}`);
  }
};

const generateAndGetAuthToken = (userInfo) => {
  try {
    return jwt.sign(userInfo, auth.getAuthTokenPrivateKey(), {
      algorithm: "RS256",
      expiresIn: "15m",
    });
  } catch (error) {
    throw new Error(`Error while generating authToken: ${error.message}`);
  }
};
