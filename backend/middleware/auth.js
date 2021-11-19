const jwt = require('jsonwebtoken');

const verifyToken = async (req, res, next) => {
    const token = req.headers["x-access-token"];

    if (!token) {
        res.json({message: "Token is required."}).end();
    }

    try {
        const decodedToken = jwt.verify(token, process.env.TOKEN_KEY);

        if (decodedToken?.id) {
            req.userData = decodedToken;
            return next();
        } else {
            res.json({message: "No any result."}).end();
        }
    } catch (e) {
        res.json({message: e.message}).end();
    }
}

module.exports = verifyToken;