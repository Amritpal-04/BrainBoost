const router = require('express').Router();
const {
  signupValidation,
  usernameAvailabilityValidation,
  loginValidation,
} = require('../Middlewares/AuthValidation');
const { signup, checkUsernameAvailability, login } = require('../Controllers/AuthController');

router.get('/username-availability', usernameAvailabilityValidation, checkUsernameAvailability);
router.post('/login', loginValidation, login);
router.post('/signup', signupValidation, signup);

module.exports = router;