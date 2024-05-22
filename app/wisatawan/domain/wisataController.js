const wisataScheme = require("../data-access/wisataSchema.js");

class ManageWisatawan{
    constructor(){
        this.message = ""
    }

    get getMessage(){
        return this.message;
    }

    set setMessage(msg){
        return this.message = msg;
    }

    getWisatawan(req, res){
        const wisata = wisataScheme.findAll({
            attributes: ["idWisata", "idPesan", "judul", "deskripsi", "harga", "diskon", "jenis", "status", "image"]
        })

        this.setMessage = wisata
        res.status(200).json(this.getMessage)
    }

    addWisatawan(req, res){
        
    }
}

module.exports = {ManageWisatawan}