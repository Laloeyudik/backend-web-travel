const {
  ManageMiddleware,
} = require("../../../libraries/middleware/manageMiddleware.js");
const touristSchema = require("../data_access/touristSchema.js");

const xlsx = require("xlsx");
const fs = require("fs");
const { ManageImage } = require("../../../libraries/images/imageManager.js");

const manageMiddleware = new ManageMiddleware();

class TouristManager {
  #managerImage = new ManageImage();
  #linkImage;
  constructor() {
    this.message = "";
  }

  get getMessage() {
    return this.message;
  }

  set setMessage(msg) {
    return (this.message = msg);
  }

  async getTourist(res) {
    const touristDatas = await touristSchema.findAll();
    this.setMessage = touristDatas;

    res.status(200).json(this.getMessage);
  }

  async getByTourist(req) {
    const { id, judul, varian, kategori } = req.query;

    const whereData = {};

    if (id) whereData.idTourist = id;
    if (judul) whereData.judul = judul;
    if (varian) whereData.varian = varian;

    const getDatasId = await touristSchema.findOne({
      where: whereData,
    });
    return getDatasId;
  }

  async getByIdTourist(req, res) {
    const dataWithIdTourist = await this.getByTourist(req);
    res.status(200).json(dataWithIdTourist);
  }

  async getByJudulTourist(req, res) {
    const dataWithJudulTourist = await this.getByTourist(req);
    this.setMessage = dataWithJudulTourist;
    res.status(200).json(this.getMessage);
  }

  async getByVarianTourist(req, res) {
    const dataWithVarianTourist = await this.getTourist(req);
    this.setMessage = dataWithVarianTourist;
    res.status(200).json(this.getMessage);
  }

  async addTourist(req, res) {
    const {
      judul,
      price: { priceTourist, priceStatus },
      varian,
      kategori,
      deskripsi: { detailTourist, kebijakan, catatan },
      diskon,
      stock,
      statusBooking,
    } = req.body;

  
    const juduTourist = await manageMiddleware.authJudul(judul);
    if (!juduTourist || !juduTourist.trim()) {
      return res.status(400).json(juduTourist);
    }
    const formatVarian = varian.map(({ nama, harga, jenis, kapasitas }) => ({
      nama,
      harga,
      jenis,
      kapasitas: {
        min: kapasitas.min,
        max: kapasitas.max,
      },
    }));

    if (req.files.length >= 1) {
      this.#linkImage = this.#managerImage.linkImage(req);
    } else if (req.files.length == 0) {
      this.setMessage = "Gambar tidak ditemukan.";
      return this.getMessage;
    }

    await touristSchema.create({
      judul: judul,
      price: {
        priceTourist: priceTourist,
        status: priceStatus,
      },
      deskripsi: {
        detailTourist: detailTourist,
        kebijakan: kebijakan.split(",") || kebijakan.split(", "),
        catatan: catatan,
      },
      varian: formatVarian,
      kategori: kategori.split(",") || kategori.split(", "),
      diskon: diskon,
      stock: stock,
      statusBooking: statusBooking,
      image: this.#linkImage,
    });

    this.setMessage = { message: "Berhasil menambahkan produk" };
    res.status(200).json(this.getMessage);
  }

  async editTourist(req, res) {
    const dataIdTourist = await this.getByTourist(req);
    if (!dataIdTourist) {
      this.setMessage = "Id kendaraan tidak di temukan";
      return this.message;
    }

    const {
      judul,
      price: { priceTourist, priceStatus },
      varian,
      kategori,
      deskripsi: { detailTourist, kebijakan, catatan },
      diskon,
      stock,
      statusBooking,
    } = req.body;


   await this.#managerImage
      .unlinkImage(dataIdTourist)
      .then(async() => {
        if (req.files.length >= 1) {
          this.#linkImage = this.#managerImage.linkImage(req);
        } else if (req.files.length == 0) {
          this.setMessage = "Gambar tidak ditemukan.";
          return this.getMessage;
        }

        const formatVarian = varian.map(({ nama, harga, jenis, kapasitas }) => ({
          nama,
          harga,
          jenis,
          "kapasitas": {
            "min": kapasitas.min,
            "max": kapasitas.max,
          },
        }));

       await dataIdTourist.update({
          judul: judul,
          price: {
            priceTourist: priceTourist,
            status: priceStatus,
          },
          deskripsi: {
            detailTourist: detailTourist,
            kebijakan: kebijakan.split(",") || kebijakan.split(", "),
            catatan: catatan,
          },
          varian: formatVarian,
          kategori: kategori.split(",") || kategori.split(", "),
          diskon: diskon,
          stock: stock,
          statusBooking: statusBooking,
        });

        this.setMessage = { message: "Berhasil mengedit produk" };
        res.status(200).json(this.getMessage);
      })
      .catch((err) => {
        if (err) {
          console.table(err);
          this.setMessage = res.json("Maaf gagal melakukan edit.");
          return this.getMessage;
        }
      });
  }
}

module.exports = { TouristManager };
