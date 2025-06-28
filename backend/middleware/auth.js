// middleware/auth.js

const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // ✅ extract only the token

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // ✅ verify
    req.user = decoded; // ✅ sets req.user with role
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid Token" });
  }
}

function authorizeRoles(...roles) {
  return (req, res, next) => {
    console.log("🔐 User role:", req.user?.role); // ✅ should log 'patient'
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  };
}

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
}
module.exports = {
  verifyToken,
  authorizeRoles,
  authenticate,
};
