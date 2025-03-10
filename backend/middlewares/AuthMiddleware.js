const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization') && req.header('Authorization').replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ success: false, message: "No token, authorization denied" });
    }
    try {
        const decode = jwt.verify(token, process.env.SECRET_JWT);
        req.user = decode
        next();
    }
    catch (error) {
        res.status(401).json({ success: false, message: "Token is not valid" });
    }
}

module.exports = authMiddleware;