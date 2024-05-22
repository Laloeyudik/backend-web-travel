const express = require("express");
const { ManageImage } = require("../../../libraries/images/imageManager");
const { ProdukManager } = require("../domain/produkController.js");

const managerProduk = new ProdukManager();
const managerImage = new ManageImage();
const routeProduk = express.Router();

routeProduk.get("/produk", (req, res) => {
  if (req.query.id) {
    return managerProduk.getDataProdukById(req, res);
  } else if (req.query.t) {
    return managerProduk.getDataProdukByJudul(req, res);
  } else if (req.query.v) {
    return managerProduk.getDataProdukByVarian(req, res);
 } else if(req.query.c){
   return managerProduk.getDataProdukByKategori(req, res)
 }else if(req.query.kategori){

 }else {
    return managerProduk.getDataProduk(res);
  }
});

routeProduk.get('/produk/c/:kategori', (req, res)=>{
  return managerProduk.getDataProdukKategory(req, res)
})
routeProduk.post(
  "/add/produk",
  managerImage.upload().array("image", 9),
  (req, res) => {
    return managerProduk.addProduk(req, res);
  }
);

routeProduk.put(
  "/update/produk",
  managerImage.upload().array("image", 9),
  (req, res) => {
    return managerProduk.updateProduk(req, res);
  }
);

routeProduk.delete("/delete/produk", (req, res) => {
  return managerProduk.deleteProduk(req, res);
});

module.exports = routeProduk;
