const xlsx = require("xlsx")
const fs = require("fs")

class UploadMasalManager{
    constructor(){
        this.message = ""
    }

    get getMessage(){
        return this.message;
    }

    set setMessage(msg){
        return this.message = msg
    }

    

}

module.exports = {UploadMasalManager}