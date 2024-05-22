const { ManageImage } = require("../../../libraries/images/imageManager.js")
const {ManageKendaraan} = require("../domain/kendaraanController.js")

const express = require("express")

const kendaraanManager = new ManageKendaraan()
const imageManager = new ManageImage()
const routeKendaraan = express.Router()

routeKendaraan.get("/kendaraan", (req, res)=>{
    return kendaraanManager.getKendaraan(req, res)
})

routeKendaraan.get("/kendaraan/by", (req, res)=>{
    return kendaraanManager.getByIdKendaraan(req, res)
})

routeKendaraan.get("/kendaraan/by", (req, res)=>{
    return kendaraanManager.getByJudulKendaraaan(req, res)
})
routeKendaraan.get("/kendaraan/by", (req, res)=>{
    return kendaraanManager.getByJenisKendaraaan(req, res)
})
routeKendaraan.post("/kendaraan", (req, res)=>{
    return kendaraanManager.getFilterHarga(req, res)
})


routeKendaraan.post("/addKendaraan", imageManager.upload().array("image", 7), (req, res)=>{
    return kendaraanManager.addKendaraan(req, res)
})

routeKendaraan.put("/update/kendaraan",imageManager.upload().array("image", 7), (req, res)=>{
    return kendaraanManager.updateKendaraan(req, res)
})
routeKendaraan.delete("/delete/kendaraan", (req, res)=>{
    return kendaraanManager.deleteKendaraan(req, res)
})

module.exports = routeKendaraan