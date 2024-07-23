import jwt from "jsonwebtoken";

export const verifyToken = async (req, res, next) => {
  try {
    // Extract token from Authorization header
    let token = req.header("Authorization");

    // If no token is provided, deny access
    if (!token) {
      return res.status(403).send("Access Denied");
    }

    // If token starts with 'Bearer ', extract the token part
    if (token.startsWith("Bearer ")) {
      token = token.slice(7).trim(); // `trim` instead of `trimLeft` for compatibility
    } else {
      // Handle cases where token does not start with 'Bearer '
      return res.status(403).send("Invalid Token Format");
    }

    // Verify the token
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified; // Attach user data to request object
    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    res.status(500).json({ error: err.message }); // Handle any errors during token verification
  }
};
