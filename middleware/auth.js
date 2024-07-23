import jwt from "jsonwebtoken";

export const verifyToken = async (req, res, next) => {
  try {
    let token = req.header("Authorization");

    if (!token) {
      return res.status(403).json({ message: "Access Denied. No token provided." });
    }

    if (token.startsWith("Bearer ")) {
      token = token.slice(7).trim();
    } else {
      return res.status(403).json({ message: "Invalid Token Format" });
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: "Token has expired. Please log in again." });
    } else if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: "Invalid token. Please log in again." });
    } else {
      console.error("Token verification error:", err);
      res.status(500).json({ message: "Failed to authenticate token" });
    }
  }
};
