const { ManageImage } = require("../../../libraries/images/imageManager.js");
const {
  ManageMiddleware,
} = require("../../../libraries/middleware/manageMiddleware.js");
const produkSchema = require("../data-access/produkSchema.js");
const { Op } = require("sequelize");
class ProdukManager {
  #manageMiddleware = new ManageMiddleware();
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

  async getByProduk(req) {
    const { id, t, v, c } = req.query;

    const whereData = {};

    if (id) whereData.idProduk = id;
    if (t) whereData.judul = t;
    if (v) {
      const varianSearchString = `%${v}%`;
      whereData.varian = { [Op.like]: varianSearchString };
    }
    if (c) whereData.kategori = c;
    const getDatasId = await produkSchema.findOne({
      where: whereData,
    });
    return getDatasId;
  }

  async getDataProduk(res) {
    const dataProduk = await produkSchema.findAll();

    this.setMessage = dataProduk;
    res.status(200).json(this.getMessage);
  }
  async getDataProdukKategory(req, res) {
    const dataProduk = await produkSchema.findAll({
      where: {
        kategori: req.params.kategori,
      },
    });

    this.setMessage = dataProduk;
    res.status(200).json(this.getMessage);
  }

  async getDataProdukById(req, res) {
    const dataIdProduk = await this.getByProduk(req);
    this.setMessage = dataIdProduk;
    res.status(200).json(this.getMessage);
  }

  async getDataProdukByJudul(req, res) {
    const dataJudulProduk = await this.getByProduk(req, res);
    this.setMessage = dataJudulProduk;
    res.status(200).json(this.getMessage);
  }

  async getDataProdukByVarian(req, res) {
    const dataVarianProduk = await this.getByProduk(req);
    this.setMessage = dataVarianProduk;
    res.status(200).json(dataVarianProduk);
  }
  async getDataProdukByKategori(req, res) {
    const dataKategoriProduk = await this.getByProduk(req);
    this.setMessage = dataKategoriProduk;
    res.status(200).json(dataKategoriProduk);
  }

  // Add Produk
  async addProduk(req, res) {
    const {
      judul,
      harga,
      jenisHarga,
      varian,
      kategori,
      deskripsi,
      diskon,
      stock,
      min,
      max,
      statusBooking,
    } = req.body;

    if (req.files.length >= 1) {
      this.#linkImage = this.#managerImage.linkImage(req);
    } else if (req.files.length == 0) {
      this.setMessage = "Gambar tidak ditemukan.";
      return this.getMessage;
    }
  //   if (!req.files || req.files.length === 0) {
  //     return res.status(400).json({ message: "Gambar tidak ditemukan." });
  // }
  //   this.#linkImage = this.#managerImage.linkImage(req);
  //   console.log("img", req.files);

    await produkSchema.create({
      judul: judul,
      harga: harga,
      jenisHarga: jenisHarga,
      varian: varian.split(",") || varian.split(", "),
      kategori: kategori,
      deskripsi: deskripsi,
      diskon: diskon,
      stock: stock,
      min: min,
      max: max,
      statusBooking: statusBooking,
      image: this.#linkImage,
    });

    this.setMessage = { message: "Berhasil nambah produk" };
    res.status(201).json(this.getMessage);
  }

  // Update Produk
  async updateProduk(req, res) {
    const dataIdProduk = await this.getByProduk(req);
    if (!dataIdProduk) {
      this.setMessage = "Id produk tidak di temukan";
      return this.message;
    }

    const {
      judul,
      harga,
      jenisHarga,
      varian,
      kategori,
      deskripsi,
      diskon,
      stock,
      min,
      max,
      statusBooking,
    } = req.body;

    await this.#managerImage
      .unlinkImage(dataIdProduk)
      .then(async () => {
        if (req.files.length >= 1) {
          this.#linkImage = this.#managerImage.linkImage(req);
        } else if (req.files.length == 0) {
          this.setMessage = "Gambar tidak ditemukan.";
          return this.getMessage;
        }

        await dataIdProduk.update({
          judul: judul,
          harga: harga,
          jenisHarga: jenisHarga,
          varian: varian.split(",") || varian.split(", "),
          kategori: kategori,
          deskripsi: deskripsi,
          diskon: diskon,
          stock: stock,
          min: min,
          max: max,
          statusBooking: statusBooking,
          image: this.#linkImage,
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

  // Delete Produk
  async deleteProduk(req, res) {
    const dataIdProduk = await this.getByProduk(req);
    if (!dataIdProduk) {
      this.setMessage = "Id produk tidak di temukan";
      return this.message;
    }

    await this.#managerImage
      .unlinkImage(dataIdProduk)
      .then(() => {
        dataIdProduk.destroy();
        this.setMessage = { message: "Berhasil delete produk" };
        res.status(200).json(this.getMessage);
      })
      .catch((err) => {
        if (err) {
          this.setMessage = err;
          res.status(200).json(this.getMessage);
        }
      });
  }
}

module.exports = { ProdukManager };
