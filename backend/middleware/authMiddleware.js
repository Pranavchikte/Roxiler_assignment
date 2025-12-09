const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ error: "Access Denied. No token provided." });
  }

  try {
    const cleanToken = token.replace("Bearer ", "");
    const verified = jwt.verify(cleanToken, process.env.JWT_SECRET);
    req.user = verified; 
    next();
  } catch (err) {
    res.status(400).json({ error: "Invalid Token" });
  }
};

const authorize = (roles = []) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ error: "Access Forbidden. You do not have permission." });
    }
    next();
  };
};

module.exports = { protect, authorize };
