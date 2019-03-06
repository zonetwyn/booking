const jwt = require('jsonwebtoken');

const authorize = (roles = []) => {
    return (req, res, next) => {
        const token = req.headers.authorization.split(' ')[1];
        if (token) {
            const payload = jwt.decode(token);
            if (roles.includes(payload.role)) {
                next();
            } else {
                return res.status(401).json({
                    error: 'Your are not authorized to access this resource'
                })
            }
        }
    }
};

module.exports = authorize;