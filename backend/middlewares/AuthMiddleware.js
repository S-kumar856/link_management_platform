const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization');

    if(!token){
        return res.status(401).json({msg: 'No token, authorization denied'});
    }

    try{
        const decoded = jwt.verify(token, process.env.SECRET_JWT);
        req.user = decoded; // Set the decoded user in the request
        next();
    }
    catch(error){
        return res.status(400).json({success: false, message: 'Invalid token'});
        console.log(error);

    }
};

module.exports = authMiddleware;