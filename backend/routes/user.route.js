const express = require('express');
const {check, validationResult} = require('express-validator');
const { registerUser, loginUser, getUsers } = require('../controllers/user.controllers');
const Auth = require('../middlewares/AuthMiddleware');

const router = express.Router();

// Register a user
router.post(
    '/register',
[
    check('name', 'Name is required').not().isEmpty(),
    check('username', 'Username is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password must be at least 6 characters').isLength({min: 6})
],
registerUser
);


// Login a user
router.post(
    '/login',
    [
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Password is required').exists()
    ],
    loginUser
);

// Get all users
router.get('/getusers', Auth, getUsers);

module.exports = router;