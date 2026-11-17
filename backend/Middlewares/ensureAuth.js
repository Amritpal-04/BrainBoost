const jwt = require("jsonwebtoken");

function ensureAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";

  if (!token) {
    return res.status(401).json({ success: false, message: "Please log in to continue." });
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET || "secret-123");
    return next();
  } catch {
    return res.status(401).json({
      success: false,
      message: "Your session has expired. Please log in again.",
    });
  }
}

module.exports = { ensureAuth };
