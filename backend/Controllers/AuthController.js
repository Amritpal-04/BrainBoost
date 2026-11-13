const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  getCountries,
  getCountryCallingCode,
  isValidPhoneNumber,
  parsePhoneNumber,
} = require("libphonenumber-js");
const UserModel = require("../Models/User");


const getPassword = (body) => body.password ?? body.passward;

const signup = async (req, res) => {
  try {
    const {
      name, email, username, birthDate, gender, phoneNumber, phoneCountry,
      educationLevel, learningGoal,
    } = req.body;
    const password = getPassword(req.body);

    if (!name || !email || !username || !birthDate || !gender || !phoneNumber || !phoneCountry || !password) {
      return res.status(400).json({ message: "All signup fields are required", success: false });
    }

    if (!getCountries().includes(phoneCountry)) {
      return res.status(400).json({ message: "Select a valid phone country", success: false });
    }

    const parsedPhone = parsePhoneNumber(phoneNumber);
    if (
      !parsedPhone ||
      !isValidPhoneNumber(phoneNumber) ||
      parsedPhone.countryCallingCode !== getCountryCallingCode(phoneCountry)
    ) {
      return res.status(400).json({ message: "Enter a valid phone number for the selected country", success: false });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = await UserModel.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(409).json({ message: "User already exists", success: false });
    }

    const normalizedUsername = username.toLowerCase().trim();
    const existingUsername = await UserModel.findOne({ username: normalizedUsername });
    if (existingUsername) {
      return res.status(409).json({ message: "Username is already taken", success: false });
    }

    const userModel = new UserModel({
      name: name.trim(),
      email: normalizedEmail,
      username: normalizedUsername,
      birthDate,
      gender,
      phoneNumber,
      phoneCountry,
      educationLevel: educationLevel || undefined,
      learningGoal: learningGoal || undefined,
      password: await bcrypt.hash(password, 10),
    });

    await userModel.save();
    return res.status(201).json({ message: "Signup successfully", success: true });
  } catch (err) {
    if (err.code === 11000) {
      const duplicateField = Object.keys(err.keyPattern || {})[0];
      const message = duplicateField === "username"
        ? "Username is already taken"
        : "User already exists";
      return res.status(409).json({ message, success: false });
    }
    return res.status(500).json({ message: "Internal server error", success: false, error: err.message });
  }
};

const checkUsernameAvailability = async (req, res) => {
  try {
    const username = req.query.username.toLowerCase().trim();
    const existingUser = await UserModel.exists({ username });
    return res.status(200).json({ success: true, available: !existingUser });
  } catch {
    return res.status(500).json({ message: "Unable to check username right now", success: false });
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
        username: user.username,
        birthDate: user.birthDate,
        gender: user.gender,
        phoneNumber: user.phoneNumber,
        phoneCountry: user.phoneCountry,
        educationLevel: user.educationLevel,
        learningGoal: user.learningGoal,
      },
    });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error", success: false, error: err.message });
  }
};
module.exports = { signup, checkUsernameAvailability, login };