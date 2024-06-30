const express = require("express");
const bodyParser = require("body-parser");
const db = require("./libraries/databases/db.js");
const path = require("path");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const compression = require("compression");
const job = require("./libraries/authentication/cronJob.js");
const { SitemapStream, streamToPromise } = require("sitemap");
const { createGzip } = require("zlib");
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

serv.use(
  compression({
    level: 9,
    threshold: 10 * 1000,
    filter: (req, res) => {
      if (req.headers["x-no-compression"]) return false;
      return compression.filter(req, res);
    },
  })
);

serv.use(cookieParser());
serv.use(morgan("tiny"));
serv.use(
  cors({
    origin: [`${process.env.ENDPOINT_ADMIN}`, `${process.env.ENDPOINT}`],
    credentials: true,
    preflightContinue: false,
  })
);

serv.use(
  "/libraries/images/public/",
  express.static(path.join(__dirname, "/libraries/images/public/"))
);

serv.use(
  "/upload/document",
  express.static(path.join(__dirname, "/upload/document"))
);
serv.use(
  "/public",
  express.static("/public", {
    setHeaders: (res) => {
      res.set("Cache-Control", "public, max-age=31536000");
    },
  })
);

// routing

serv.use(`/${process.env.VERSION}`, require("./app/users/api/usersRouters.js"));
serv.use(
  `/${process.env.VERSION}`,
  require("./app/product/api/produkRoutes.js")
);
serv.use(
  `/${process.env.VERSION}`,
  require("./app/reviews/api/reviewRoutes.js")
);

serv.use(`/${process.env.VERSION}`, require("./app/admin/api/adminRoute.js"));
serv.use(
  `/${process.env.VERSION}`,
  require("./app/messages/api/messageRoute.js")
);
serv.use(
  `/${process.env.VERSION}`,
  require("./app/document/api/documentRout.js")
);
serv.use(`/${process.env.VERSION}`, require("./app/blogs/api/blogs_route.js"));

// Job Cron
job.start();

// SiteMap

// SPA
serv.use(express.static('public_html'));
serv.get('/*', function(request, response) { response.sendFile(path.resolve('public_html', 'index.html')); });


serv.listen(5000, () => {
  console.log(`SERVER RUNNING ON ${process.env.PORT_SERV}`);
});
