const express = require("express");
const bodyParser = require("body-parser");
const db = require("./libraries/databases/db.js");
const path = require("path")
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require('cookie-parser')
require("dotenv").config();

const serv = express();
serv.use(bodyParser.json());
serv.use(bodyParser.urlencoded({ extended: true }));

db.authenticate()
  .then(() => {
    console.log("Database connected..");
    return db.sync();
  })
  .then(() => {
    console.log("Database synchronized..");
  })
  .catch((err) => {
    if (err) {
      console.log("Database not connected", err);
    }
  });
serv.use(cookieParser())
serv.use(morgan("tiny"))
serv.use(cors({
  origin: [`${process.env.ENDPOINT_ADMIN}`,`${process.env.ENDPOINT}`],
  credentials: true,
  preflightContinue: false,
}))

serv.use('/libraries/images/public', express.static(path.join(__dirname, '/libraries/images/public')));
serv.use('/upload/document', express.static(path.join(__dirname, '/upload/document')));

// routing
serv.use(
  `/${process.env.VERSION}`,
  require("./app/tourist/api/touristRoutes.js")
);
serv.use(
  `/${process.env.VERSION}`,
  require("./app/users/api/usersRouters.js")
);
serv.use(
  `/${process.env.VERSION}`,
  require("./app/product/api/produkRoutes.js")
);
serv.use(
  `/${process.env.VERSION}`,
  require("./app/reviews/api/reviewRoutes.js")
);
serv.use(
  `/${process.env.VERSION}`,
  require("./app/uploadMasal/api/uploadFIleExcelTemplate.js")
);
serv.use(
  `/${process.env.VERSION}`,
  require("./app/admin/api/adminRoute.js")
);
serv.use(
  `/${process.env.VERSION}`,
  require("./app/messages/api/messageRoute.js")
);
serv.use(
  `/${process.env.VERSION}`,
  require("./app/document/api/documentRout.js")
);



serv.listen(5000, () => {
  console.log("Server RUNNING..");
});
