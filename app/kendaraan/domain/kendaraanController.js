const { ManageImage } = require("../../../libraries/images/imageManager.js");
const {
  ManageMiddleware,
} = require("../../../libraries/middleware/manageMiddleware.js");
const kendaraanScheme = require("../data-access/kendaraanSchema.js");

class ManageKendaraan {
  #middlewareManager = new ManageMiddleware();
  #imageManager = new ManageImage();
  #linkImages;

  constructor() {
    this.message = "";
  }

  get getMessage() {
    return this.message;
  }

  set setMessage(msg) {
    return (this.message = msg);
  }

  async getKendaraan(req, res) {
    const kendaraan = await kendaraanScheme.findAll({
      attributes: [
        "idKendaraan",
        "judul",
        "deskripsi",
        "harga",
        "diskon",
        "varian",
        "jenisKendaraan",
        "status",
        "image",
      ],
    });
    this.setMessage = kendaraan;
    res.status(200).json(this.getMessage);
  }

  async getIdKendaraan(req) {
    const { id, judul, jenis, varian } = req.query;
    const whereData = {};

    if (id) whereData.idKendaraan = id;
    if (judul) whereData.judul = judul;
    if (jenis) whereData["jenisKendaraan.nama"] = jenis;

    if (varian) whereData.varian = varian;

    const kendaraan = await kendaraanScheme.findOne({
      attributes: [
        "idKendaraan",
        "judul",
        "deskripsi",
        "harga",
        "diskon",
        "varian",
        "jenisKendaraan",
        "status",
        "image",
      ],
      where: whereData,
    });

    return kendaraan;
  }

  async getByIdKendaraan(req, res) {
    const idKendaraans = await this.getIdKendaraan(req);
    res.status(200).json(idKendaraans);
  }

  async getByJudulKendaraaan(req, res) {
    const judulKendaraan = await this.getIdKendaraan(req);
    res.status(200).json({ judulKendaraan });
  }

  async getByJenisKendaraaan(req, res) {
    const jenisKendaraan = await this.getIdKendaraan(req);
    res.status(200).json({ jenisKendaraan });
  }

  async getFilterHarga(req, res) {
    const kendaraan = await kendaraanScheme.findAll({
      attributes: [
        "idKendaraan",
        "judul",
        "deskripsi",
        "harga",
        "diskon",
        "varian",
        "jenisKendaraan",
        "status",
        "image",
      ],
    })
    const {from, until} = req.body
    const hasilFilter = await kendaraan.filter(items => items.harga >= from && items.harga <= until)
    res.status(200).json(hasilFilter)
  }

  async addKendaraan(req, res) {
    const {
      judul,
      deskripsi: { kebijakan, infoPenting, infoKendaraan },
      harga,
      diskon,
      varian: { namaVarian, nilaiVarian },
      jenisKendaraan: { namaKendaraan, tipeKendaraan, jenisKendaraan , kapasitasKendaraan},
      status,
    } = req.body;

    

    if (req.files.length >= 1) {
      this.#linkImages = this.#imageManager.linkImage(req);
    } else if (req.files.length == 0) {
      this.setMessage = "Gambar tidak ditemukan.";
      return this.getMessage;
    }

    const judulKendaraan = await this.#middlewareManager.authJudul(judul);
    if (!judulKendaraan || !judulKendaraan.trim()) {
      return res.status(400).json(judulKendaraan);
    }


    kendaraanScheme.create({
      judul: judul,
      deskripsi: {
        Kebijakan: kebijakan.split(",") || kebijakan.split(","),
        infoPenting: infoPenting.split(",") || infoPenting.split(","),
        infoKendaraan: `${infoKendaraan}`,
      },
      harga: harga,
      diskon: diskon,
      varian: {
        nama: `${namaVarian}`,
        nilai: nilaiVarian.split(", ") || nilaiVarian.split(","),
      },
      jenisKendaraan: {
        nama: `${namaKendaraan}`,
        tipe: `${tipeKendaraan}`,
        jenis: `${jenisKendaraan}`,
        kapasitas: `${kapasitasKendaraan}`
      },
      status: status,
      image: this.#linkImages,
    });

    this.setMessage = "Berhasil Nambah Produk.";
    res.status(201).json(this.getMessage);
  }

  async updateKendaraan(req, res) {
    const idKendaraan = await this.getIdKendaraan(req);
    if (!idKendaraan) {
      this.setMessage = "Id kendaraan tidak di temukan";
      return this.message;
    }
    const {
      judul,
      deskripsi: { kebijakan, infoPenting, infoKendaraan },
      harga,
      diskon,
      varian: { namaVarian, nilaiVarian },
      jenisKendaraan: { namaKendaraan, tipeKendaraan, jenisKendaraan, kapasitasKendaraan},
      status,
    } = req.body;

    await this.#imageManager
      .unlinkImage(idKendaraan)
      .then(async () => {
        if (req.files.length >= 1) {
          this.#linkImages = this.#imageManager.linkImage(req);
        } else if (req.files.length == 0) {
          this.setMessage = "Gambar tidak ditemukan.";
          return this.getMessage;
        }

        idKendaraan.update({
          judul: judul,
          deskripsi: {
            Kebijakan: kebijakan.split(",") || kebijakan.split(","),
            infoPenting: infoPenting.split(",") || infoPenting.split(","),
            infoKendaraan: `${infoKendaraan}`,
          },
          harga: harga,
          diskon: diskon,
          varian: {
            nama: `${namaVarian}`,
            nilai: nilaiVarian.split(", ") || nilaiVarian.split(","),
          },
          jenisKendaraan: {
            nama: `${namaKendaraan}`,
            tipe: `${tipeKendaraan}`,
            jenis: `${jenisKendaraan}`,
            kapasitas: `${kapasitasKendaraan}`
          },
          status: status,
          image: this.#linkImages,
        });

        this.setMessage = "Berhasil Edit Produk.";
        res.status(201).json(this.getMessage);
      })
      .catch((err) => {
        if (err) {
          this.setMessage = res.json("Maaf gagal melakukan edit.");
          return this.message;
        }
      });
  }

  async deleteKendaraan(req, res) {
    const idKendaraan = await this.getIdKendaraan(req);
    if (!idKendaraan) {
      this.setMessage = "Id kendaraan tidak di temukan";
      return this.message;
    }

    await this.#imageManager
      .unlinkImage(idKendaraan)
      .then(async () => {
        await idKendaraan.destroy();
        this.setMessage = "Berhasil delete produk";
        res.status(200).json(this.getMessage);
      })
      .catch((err) => {
        if (err) {
          this.setMessage = res.json("Maaf tidak bisa melakukan delete.");
          return this.message;
        }
      });
  }
}

module.exports = { ManageKendaraan };
