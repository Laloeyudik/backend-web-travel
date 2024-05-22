class ManageMiddleware{
    constructor(){
        this.message = ""
    }

    get getMessage(){
        return this.message;
    }

    set setMessage(msg){
        return this.message = msg
    }

    authJudul(judul) {
        const regExp = /^[a-zA-Z0-9\s]+$/
        if (judul == undefined || judul == null) {
          this.setMessage = "Judul tidak boleh kosong";
          return this.getMessage;
        }else{
          if (regExp.test(judul)) {
            return judul;
          }else{
            this.setMessage = `Format judul tidak sesuai, masukan a-zA-Z0-9`
            return this.getMessage
          }
        }
      }
}

module.exports = {ManageMiddleware}