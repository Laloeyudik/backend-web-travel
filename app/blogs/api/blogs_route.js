const express = require("express");

const { BlogsManage } = require("../domain/blogs_controller.js");
const manageBlogs = new BlogsManage();

const routeBlogs = express.Router();

routeBlogs.get("/artikels", (req, res) => {
  if (req.query.id) {
    return manageBlogs.getArtikelByIds(req);
  } else if (req.query.t) {
    return manageBlogs.getArtikelByTitle(req, res);
  } else if (req.query.c) {
    return manageBlogs.getArtikelByCategori(req, res);
  } else if (req.query.kategori) {
  } else {
    return manageBlogs.getArtikels(res);
  }
});
routeBlogs.post("/addArtikels", async (req, res) => {
  await manageBlogs.addArtikel(req, res);
});

routeBlogs.put("/update/artikels", async (req, res) => {
  await manageBlogs.updateArtikel(req, res);
});
routeBlogs.delete("/delete/artikels", async (req, res) => {
  await manageBlogs.deleteArtikel(req, res);
});

module.exports = routeBlogs;
