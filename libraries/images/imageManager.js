const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

class ManageImage {
  constructor() {
    this.message = "";
  }

  get getMessage() {
    return this.message;
  }

  set setMessage(msg) {
    return (this.message = msg);
  }

  typeImage(req, file, cb) {
    const extName = path.extname(file.originalname);
    const types = [".jpg", ".jpeg", ".gif", ".png", ".webp", ".heic"];

    if (!types.includes(extName.toLowerCase())) {
      cb((err) => {
        if (err) {
          console.log("Format gambar tidak didukung. ");
        }
      });
    } else {
      cb(null, true);
    }
  }

  storage() {
    return multer.diskStorage({
      destination: (req, file, cb) => {
        const filePath = path.join(__dirname, "./public/");
        if (!fs.existsSync(filePath)) {
          fs.mkdirSync(filePath, (err) => {
            if (err) {
              this.setMessage = { msg: "folder disk gagal di buat." };
            }
          });
        } else {
          cb(null, filePath);
        }
      },
      filename: (req, file, cb) => {
        cb(null, uuidv4() + path.extname(file.originalname));
      },
    });
  }

  upload() {
    return multer({
      storage: this.storage(),
      fileFilter: this.typeImage,
    });
  }

  linkImage(req) {
    const images = req.files.map((file) => ({
      "filename": `${file.filename}`,
      "link": `${req.protocol}://${req.get("host")}/libraries/images/public/${
        file.filename
      }`,
    }));
    return images;
  }

 async unlinkImage(idKendaraan) {
    try {
      const imageData = idKendaraan.dataValues.image;
      const imageObject = JSON.parse(imageData);
      await imageObject.forEach(image => {
            const filePath = path.join(__dirname, "./public/", image.filename);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath, (err) => {
                    if (err) {
                        console.log(err);
                        this.setMessage = "Image error, gagal terhapus.";
                        return this.getMessage; 
                    }
                });
            }
        });
    } catch (error) {
        console.log(error);
    }
}




}

module.exports = { ManageImage };
