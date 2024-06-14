const express = require("express")
const { UploadExcelTemplate } = require("../domain/uploadExcelTemplate")
const { ManageImage } = require("../../../libraries/images/imageManager")


const uploadExcelManager = new UploadExcelTemplate()
const managerImage = new ManageImage()

const routeUploadFileExcel = express.Router()

routeUploadFileExcel.post('/upload-excel', managerImage.upload().single("excel"),(req, res)=>{
    return uploadExcelManager.uploadExcelTemplate(req, res)
})

routeUploadFileExcel.get('/excel', (req, res)=>{
    return uploadExcelManager.getExcelFile(req, res)
})


module.exports = routeUploadFileExcel