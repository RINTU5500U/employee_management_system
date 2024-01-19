const jwt = require("jsonwebtoken");

module.exports = {
    authentication: (req, res, next) => {
        try {
            let token = req.headers["token"];
            if (!token) {
                return res.status(400).send({ status: false, message: "Token is missing" });
            }
            jwt.verify(token, "Secret-key", function (error, decoded) {
                if (error) {
                    return res.status(401).send({ status: false, msg: "Authentication Failed" });
                } else {
                    req.decodedToken = decoded;
                    next();
                }
            });
        } catch (error) {
            return res.status(500).send({ status: false, message: error.message });
        }
    },
    authorization: async (req, res, next) => {
        try {
            let employeeId = req.params.employeeId
            if (!employeeId) {
                return res.status(400).send({ status: false, msg: "plz enter employeeId" });
            }
            if (req.decodedToken.employeeId != employeeId) {
                return res.status(403).send({ status: false, msg: "Unauthorized person" });
            }
            next()
        } catch (error) {
            return res.status(500).send({ status: false, message: error.message });
        }
    }
}