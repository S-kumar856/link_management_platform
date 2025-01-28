const User = require('../schema/user.schema');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

// Register a new user
exports.registerUser = async (req, res) => {
    const { name, mobile, email, password } = req.body;

    // validation results

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    try {
        // check if email already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' })
        }

        // hasing the password using gensalt and hash

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // create a new user
        user = new User({
            name,
            mobile,
            email,
            password: hashedPassword
        });

        // save the user

        await user.save();


        // create and return jwt token
        const payload = { user: { id: user.id } };
        const token = jwt.sign(payload, process.env.SECRET_JWT, { expiresIn: '24h' });

        res.status(200).json({ message: "User registered successfully", token });
    } catch (error) {
        res.status(500).json({ msg: 'Error  in registering user' });
    }
};

// update user
exports.updateUser = async (req, res) => {
    const { name, mobile, email, oldPassword, newPassword } = req.body;
    const userId = req.user.id;

    try {
        // fetch the user
        const user = await User.findById(userId);

        // check if user exists
        if (!user) {
            return res.status(400).json({ success: false, msg: 'User not found' });
        }

        // update name if provided
        if (name && name !== user.name) {
            user.name = name;
        }

        // update username if provided
        if (mobile && mobile !== user.mobile) {
            const existingMobile = await User.findOne({ mobile });
            if(existingMobile){
                return res.status(400).json({ success: false, msg: 'Mobile number already exists' });
            }
            user.mobile = mobile;
        }

        // update email if provided
        if (email && email !== user.email) {
            const existingEmail = await User.findOne({ email });
            if (existingEmail) {
                return res.status(400).json({ success: false, msg: 'Email already exists' });
            }
            user.email = email;
        }
        
        // save the user
        await user.save();
        res.status(200).json({ success: true, msg: 'User updated successfully' });
    } catch (error) {
        console.error('Error in updating user:', error.message);
        res.status(500).json({ success: false, msg: 'Internal server error' });
    }
}

// get all users
exports.getUsers = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await User.findById(userId).select('-password');
        if (!user) {
            return res.status(400).json({ msg: 'User not found' });
        }
        res.status(200).json({ success: true, user });
    } catch (error) {
        console.error('Error in getting users:', error.message);
        res.status(500).json({ msg: 'Error in getting users' });

    }
};

// delete user
exports.deleteUser = async (req, res) => {
    const userId = req.user.id;
    try {
        // Find and delete the user directly
        const user = await User.findByIdAndDelete(userId);

        if (!user) {
            return res.status(400).json({ success:false, msg: 'User not found' });
        }

        res.status(200).json({ success: true, msg: 'User deleted successfully' });
    } catch (error) {
        console.error('Error in deleting user:', error.message);
        res.status(500).json({ success: false, msg: 'Internal server error' });
    }
};


// login user

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    //  validate user input
    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    // find user by email 
    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ success: false, message: 'User not found' })
        }
        // Check if password matches (assuming you use bcrypt for password encryption)
        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if (!isPasswordMatch) {
            return res.status(400).json({ success: false, message: "Invalid credentials" })
        }

        // Generate a JWT token with user id and email
        const token = jwt.sign({ id: user._id, email: user.email }, process.env.SECRET_JWT,
            {
                expiresIn: '24h',

            });

        res.cookie("token", token)
        res.status(200).json({ success: true, message: 'User logged in successfully', token })


    } catch (error) {
        console.error('Error in logged in:', error.message);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

