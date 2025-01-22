const User = require('../schema/user.schema');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

// Register a new user
exports.registerUser = async (req, res) => {
    const { name, username, email, password } = req.body;

    // validation results

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }

    try{
        // check if email already exists
        let user = await User.findOne({email});
        if(user){
            return res.status(400).json({msg: 'User already exists'})
        }

        // hasing the password using gensalt and hash

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // create a new user
        user = new User({
            name,
            username,
            email,
            password: hashedPassword
        });

        // save the user

        await user.save();
    

    // create and return jwt token
    const payload = { user: { id: user.id } };
    const token = jwt.sign(payload, process.env.SECRET_JWT, {expiresIn: '24h'});

    res.status(200).json({message: "User registered successfully", token});
    }catch(error){
        res.status(500).json({msg: 'Error  in registering user'});
    }
}


// login user

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    //  validate user input
    if (!email || !password){
        return res.status(400).json({ success: false,  message: 'Please provide email and password'});
    }

    // find user by email 
    try {
         const user = await User.findOne({email});

         if(!user){
            return res.status(400).json({success: false, message: 'User not found'})
         }
          // Check if password matches (assuming you use bcrypt for password encryption)
          const isPasswordMatch = await bcrypt.compare(password, user.password);

          if(!isPasswordMatch){
            return res.status(400).json({success: false, message: "Invalid credentials"})
          }

          // Generate a JWT token with user id and email
          const token = jwt.sign({id:user._id, email: user.email}, process.env.SECRET_JWT, 
            {expiresIn: '24h',

            });
            

    } catch (error) {
        console.log(error);
    }
};

