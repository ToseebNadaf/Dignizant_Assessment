const checkRole = (role) => (req, res, next) => {
  if (req.user.role !== role) {
    return res.status(403).json({
      message: "Access denied. You do not have the required permissions.",
      success: false,
    });
  }
  next();
};

module.exports = { checkRole };
