const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
  const authorization = req.get("authorization") || "";
  const token = authorization.match(/^Bearer\s+(.+)$/i)?.[1];
  if (!token) {
    return res.status(401).json({ message: "Authentication is required", success: false });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || "secret-123");
    if (!payload || typeof payload !== "object" || !payload.id) {
      return res.status(401).json({ message: "Invalid authentication token", success: false });
    }

    req.auth = { id: payload.id };
    return next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired authentication token", success: false });
  }
};

module.exports = authenticate;
