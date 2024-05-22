const { ManageImage } = require("../../../libraries/images/imageManager");
const reviewSchema = require("../data-access/reviewSchema");

class ReviewManage {
  #linkImage;
  #manageImage = new ManageImage();

  constructor() {
    this.message = "";
  }

  get getMessage() {
    return this.message;
  }

  set setMessage(msg) {
    return (this.message = msg);
  }

  async getReviews(res) {
    const dataReview = await reviewSchema.findAll();
    this.setMessage = dataReview;
    res.status(200).json(this.getMessage);
  }

  async getIdAndKategoriReview(req) {
    const { id, c } = req.query;

    if (id) {
      const dataId = await reviewSchema.findOne({
        where: {
          idReview: id,
        },
      });
      return dataId;
    }

    if (c) {
      const dataKategori = await reviewSchema.findAll({
        where: {
          kategori: c,
        },
      });
      return dataKategori;
    }
  }

  async getReviewsByKategori(req, res) {
    const dataKategori = await this.getIdAndKategoriReview(req);
    this.setMessage = dataKategori;
    res.status(200).json(this.getMessage);
  }

  async addReviews(req, res) {
    const { name, kategori } = req.body;

    if (!kategori) {
      this.setMessage = { message: "kategori gambar tidak ditemukan" };
    }

    if (req.files.length >= 1) {
      this.#linkImage = this.#manageImage.linkImage(req);
    } else if (req.files.length == 0) {
      this.setMessage = "Gambar tidak ditemukan.";
      return this.getMessage;
    }

    await reviewSchema.create({
      name: name,
      kategori: kategori,
      image: this.#linkImage,
    });

    this.setMessage = { message: "Berhasil tambah review" };
    res.status(201).json(this.getMessage);
  }

  async deleteReview(req, res) {
    const idKategori = await this.getIdAndKategoriReview(req);

    if (!idKategori) {
      this.setMessage = { message: "id review tidak di temukan" };
      res.json(this.getMessage);
    }

    this.#manageImage.unlinkImage(idKategori);
    idKategori.destroy();
    this.setMessage = { message: "Berhasil delete reviews" };
    res.status(200).json(this.getMessage);
  }
}

module.exports = { ReviewManage };
