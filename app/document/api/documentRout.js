const express = require("express");
const { ManageDocument } = require("../domain/documentController");

const routeDocument = express.Router()
const manageDocument = new ManageDocument() 

routeDocument.get('/download/excel', (req, res)=>{
   req.params
   return manageDocument.getDownloadDocument(req, res)
})
routeDocument.get('/create/excel', (req, res)=>{
   return manageDocument.createExcelDocument(req, res)
})
routeDocument.get('/create/pdf', (req, res)=>{
   return manageDocument.createPdfDocument(req, res)
})

module.exports = routeDocument