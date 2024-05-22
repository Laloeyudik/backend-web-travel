const express = require("express")
const { ManageWisatawan } = require("../domain/wisataController")

const wisatawanManager = new ManageWisatawan()
const routeWisatawan = express.Router()

routeWisatawan.get("/wisatawan", (req, res)=>{
    return wisatawanManager.getWisatawan(req, res)
})

module.exports = routeWisatawan