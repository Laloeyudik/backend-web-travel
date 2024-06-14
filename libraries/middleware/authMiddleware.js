const Cookies = require('cookies');
const { ManageMiddleware } = require("./manageMiddleware.js");
const manageMiddleware = new ManageMiddleware();

function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  const validation = manageMiddleware.validateToken(token);

  if (validation.valid === true) {
    req.user = validation.data.email; 
    next();
  } else {
    res.status(403).json({ message: validation.message });
  }
}

module.exports = authMiddleware;

