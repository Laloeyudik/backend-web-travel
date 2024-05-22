const xlsx = require("xlsx")

class UploadExcelTemplate{
    constructor(){
        this.message = ""
    }

    get getMessage(){
        return this.message
    }

    set setMessage(msg){
        return this.message = msg
    }

    uploadExcelTemplate(req, res){
        const workbook = xlsx.readFile(req.files)
        console.log(workbook);

    }
}

module.exports = {UploadExcelTemplate}