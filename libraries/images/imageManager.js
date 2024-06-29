
const multer = require("multer");
const fs = require("fs-extra");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");

class ManageImage {
  constructor() {
    this.message = "";
  }

  get getMessage() {
    return this.message;
  }

  set setMessage(msg) {
    this.message = msg;
  }

  typeImage(req, file, cb) {
    const extName = path.extname(file.originalname);
    const types = [".jpg", ".jpeg", ".gif", ".png", ".webp", ".heic"];

    if (!types.includes(extName.toLowerCase())) {
      cb(new Error("Format gambar tidak didukung."), false);
    } else {
      cb(null, true);
    }
  }

  storage() {
    return multer.diskStorage({
      destination: async (req, file, cb) => {
        const filePath = path.join(__dirname, "./private/");
        try {
          await fs.ensureDir(filePath);
          cb(null, filePath);
        } catch (err) {
          this.setMessage = "Folder disk gagal dibuat.";
          cb(err, filePath);
        }
      },
      filename: (req, file, cb) => {
        // const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const filename = uuidv4() + path.extname(file.originalname);
        cb(null, filename);
      },
    });
  }

  async convertToWebP(filePath, outputFilePath) {
    try {
      await sharp(filePath)
        .resize(800)
        .webp({ quality: 80 })
        .toFile(outputFilePath);
    } catch (error) {
      console.error("Gagal mengonversi gambar ke WebP: ", error);
    }
  }

  upload() {
    return multer({
      storage: this.storage(),
      fileFilter: this.typeImage.bind(this),
    });
  }

  async linkImageSinggle(req){
    const images = [];
    const webpFilename = `${uuidv4()}.webp`;
      const filePath = path.join(__dirname, "./private/", req.file.filename);
      const webpFilePath = path.join(__dirname, "./public/", webpFilename);

      await this.convertToWebP(filePath, webpFilePath);

      images.push({
        filename: webpFilename,
        link: `${req.protocol}://${req.get("host")}/public/${webpFilename}`,
      });
  }


  async linkImage(req) {
    const images = [];
    for (const file of req.files) {
      // const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const webpFilename = `${uuidv4()}.webp`;
      const filePath = path.join(__dirname, "./private/", file.filename);
      const webpFilePath = path.join(__dirname, "./public/", webpFilename);

      await this.convertToWebP(filePath, webpFilePath);

      images.push({
        filename: webpFilename,
        link: `${req.protocol}://${req.get("host")}/libraries/images/public/${webpFilename}`,
      });
    }

    return images;
  }

  async unlinkImage(idKendaraan) {
    try {
      const imageData = idKendaraan.dataValues.image;
      const imageObject = JSON.parse(imageData);
      for (const image of imageObject) {
        const filePath = path.join(__dirname, "./public/", image.filename);
        if (await fs.pathExists(filePath)) {
          try {
            fs.unlinkSync(filePath);
            console.log(`File ${filePath} berhasil dihapus.`);
          } catch (err) {
            console.error(`Gagal menghapus file ${filePath}:`, err);
            this.setMessage = "Image error, gagal terhapus.";
            return this.getMessage;
          }
        }
      }
      this.setMessage = "Semua gambar berhasil dihapus.";
    } catch (error) {
      console.log("Error:", error);
      this.setMessage = "Gagal menghapus gambar.";
    }
    return this.getMessage;
  }
}

module.exports = { ManageImage };
