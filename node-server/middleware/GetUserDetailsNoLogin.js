require("dotenv").config();

const jwt = require('jsonwebtoken');

const getUser = (req, res, next) => {
    const token = req.headers['authtoken'];
    if (!token) {
        return res.status(401).json({ error: "Please authenticate using a valid token" })
    }
    try{
        const data = jwt.verify(token, process.env.SECRET_KEY);
        req.user = data.user;
        next();
    }
    catch (error) {
        return res.status(401).send({ error: "Please authenticate using a valid token" })
    }
}

module.exports = getUser;