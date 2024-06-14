// const express = require("express");
// const { ManageAdmin } = require("../domain/adminController.js");
// const manageAdmin = new ManageAdmin();
// const authMiddleware = require("../../../libraries/middleware/authMiddleware.js");

// const routeAdmin = express.Router();

// routeAdmin.get('/admin', authMiddleware, (req, res) => {
//   return manageAdmin.getAdmin(req, res);
// });

// routeAdmin.post('/add/admin', authMiddleware, (req, res) => {
//   return manageAdmin.createAdmin(req, res);
// });

// routeAdmin.post('/login', (req, res) => {
//   return manageAdmin.loginAdmin(req, res);
// });

// routeAdmin.post('/logout', (req, res) => {
//   return manageAdmin.logoutAdmin(req, res);
// });

// routeAdmin.get('/checkLogin', authMiddleware, (req, res) => {
//   return manageAdmin.checkLoginStatus(req, res);
// });

// module.exports = routeAdmin;

const express = require("express");
const { ManageAdmin } = require("../domain/adminController.js");
const manageAdmin = new ManageAdmin();
const authMiddleware = require("../../../libraries/middleware/authMiddleware.js");

const routeAdmin = express.Router();

routeAdmin.get('/admin', authMiddleware, (req, res) => {
  return manageAdmin.getAdmin(req, res);
});
routeAdmin.get('/token',  (req, res) => {
  return manageAdmin.refreshToken(req, res);
});

routeAdmin.post('/add/admin',  (req, res) => {
  return manageAdmin.createAdmin(req, res);
});

routeAdmin.post('/login', (req, res) => {
  return manageAdmin.loginAdmin(req, res);
});

routeAdmin.delete('/logout', authMiddleware, (req, res) => {
  return manageAdmin.logoutAdmin(req, res);
});

routeAdmin.get('/checkLogin', authMiddleware, (req, res) => {
  return manageAdmin.checkLoginStatus(req, res);
});

module.exports = routeAdmin;

