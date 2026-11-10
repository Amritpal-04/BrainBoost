const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserModel = require("../Models/User");


const getPassword = (body) => body.password ?? body.passward;

const signup = async (req, res) => {
  try {
    const { name, email } = req.body;
    const password = getPassword(req.body);

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required", success: false });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = await UserModel.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(409).json({ message: "User already exists", success: false });
    }

    const userModel = new UserModel({
      name: name.trim(),
      email: normalizedEmail,
      password: await bcrypt.hash(password, 10),
    });

    await userModel.save();
    return res.status(201).json({ message: "Signup successfully", success: true });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error", success: false, error: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const errorMsg = "Auth failed email or password is incorrect";

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required", success: false });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await UserModel.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(403).json({ message: errorMsg, success: false });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(403).json({ message: errorMsg, success: false });
    }

    const jwtToken = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET || "secret-123",
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Login successful",
      success: true,
      token: jwtToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error", success: false, error: err.message });
  }
};
module.exports = { signup, login };