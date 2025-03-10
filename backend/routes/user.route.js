const express = require('express');
const {check, validationResult} = require('express-validator');
const { registerUser, loginUser, getUsers, updateUser, deleteUser } = require('../controllers/user.controllers');
const Auth = require('../middlewares/AuthMiddleware');

const router = express.Router();

// Register a user
router.post(
    '/register',
[
    check('name', 'Name is required').not().isEmpty(),
    check('mobile', 'Mobile number is required').not().isEmpty().isLength({min: 10}),   
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

// Update a user
router.put(
    '/updateusers',
    Auth,
    [
        check('name', 'Name is required').not().isEmpty(),
        check('mobile', 'Mobile number is required').not().isEmpty().isLength({min: 10}),
        check('email', 'Please include a valid email').isEmail()
    ],
    updateUser
);

// delete a user
router.delete('/deleteusers', Auth, deleteUser);

// Get all users
router.get('/getusers', Auth, getUsers);

module.exports = router;