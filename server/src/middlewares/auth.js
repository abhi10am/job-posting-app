const jwt = require("jsonwebtoken");

const admin = (req, res, next) => {
  const token = req.headers["x-access-token"];

  if (!token) {
    return res.status(401).send("A token is required for authentication");
  }

  try {
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    
    if (decoded.role === "ADMIN") {
      req.user = decoded;
      return next();
    }
    else {
      return res.status(401).send("Invalid Token");
    }
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
}

const user = (req, res, next) => {
  const token = req.headers["x-access-token"];

  if (!token) {
    return res.status(401).send("A token is required for authentication");
  }
  try {
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    
    if (decoded.role === "USER") {
      req.user = decoded;
      return next();
    }
    else {
      return res.status(401).send("Invalid Token");
    }
  } catch (err) {
    return res.status(403).send("Invalid Token");
  }
}

module.exports = {
  admin, user
};