const Joi = require("joi");

const usernamePattern = /^[A-Za-z0-9_]{3,30}$/;

const signupValidation = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(100).required(),
    email: Joi.string().email().required(),
    username: Joi.string().pattern(usernamePattern).required(),
    birthDate: Joi.date().iso().max("now").required(),
    gender: Joi.string().valid("male", "female").required(),
    phoneNumber: Joi.string().pattern(/^\+[1-9]\d{6,14}$/).required(),
    phoneCountry: Joi.string().length(2).uppercase().required(),
    educationLevel: Joi.string().valid("primary", "middle", "high", "college", "other").allow(""),
    learningGoal: Joi.string().valid("math", "logic", "calculation", "confidence", "other").allow(""),
    password: Joi.string().min(4).max(100),
    passward: Joi.string().min(4).max(100),
  }).or("password", "passward");

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: "Bad request", error: error.message });
  }

  next();
};

const usernameAvailabilityValidation = (req, res, next) => {
  const schema = Joi.object({
    username: Joi.string().pattern(usernamePattern).required(),
  });
  const { error } = schema.validate(req.query);
  if (error) {
    return res.status(400).json({ message: "Invalid username", success: false });
  }

  next();
};

const loginValidation = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(4).max(100),
    passward: Joi.string().min(4).max(100),
  }).or("password", "passward");

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: "Bad request", error: error.message });
  }

  next();
};

module.exports = {
  signupValidation,
  usernameAvailabilityValidation,
  loginValidation,
};