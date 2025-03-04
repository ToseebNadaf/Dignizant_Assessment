const jwt = require("jsonwebtoken");

const validateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      message: translate("AUTHENTICATION_REQUIRED", lang),
      success: false,
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({
        message: "INVALID_TOKEN",
        success: false,
      });
    }

    req.user = user;
    next();
  });
};

module.exports = { validateToken };
