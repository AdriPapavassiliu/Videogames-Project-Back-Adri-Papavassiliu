const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  const headerAuth = req.header("Authorization");
  if (!headerAuth) {
    const error = new Error("Token missing");
    error.code = 401;
    next(error);
    return;
  }
  const token = headerAuth.replace("Bearer ", "");
  try {
    const { username, id } = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      username,
      id,
    };
    next();
  } catch (error) {
    const eror = new Error("Wrong token");
    eror.code = 401;
    next(eror);
  }
};

module.exports = { auth };
