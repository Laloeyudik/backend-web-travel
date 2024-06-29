const blogs_model = require("../data-access/blogs_models.js");
const {
  ManageMiddleware,
} = require("../../../libraries/middleware/manageMiddleware.js");
const { ManageImage } = require("../../../libraries/images/imageManager.js");

class BlogsManage {
  #manageMiddleware = new ManageMiddleware();
  #manageImages = new ManageImage();
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


  async getAriktlByQuery(req) {
    const { id, t, c } = req.query;

    const whereData = {};

    if (id) whereData.id_blog = id;
    if (t) whereData.title = t;
    if (c) whereData.categories = c;
    const getDatasId = await blogs_model.findOne({
      where: whereData,
    });
    return getDatasId;
  }

  async getArtikels(res) {
    const artikels = await blogs_model.findAll();

    res.status(200).json(artikels);
  }

  async getArtikelByIds(req, res) {
    const idArtikel = await this.getAriktlByQuery(req);

    if (!idArtikel) {
      this.setMessage = "Id artikel tidak di temukan";
    }

    const artikel = idArtikel.toJSON;
    res.status(200).json(artikel);
  }

  async getArtikelByTitle(req, res) {
    const dataArtikel = await this.getAriktlByQuery(req);
    this.setMessage = [dataArtikel];
    res.status(200).json(this.getMessage);
  }
  async getArtikelByCategori(req, res) {
    const dataArtikel = await this.getAriktlByQuery(req);
    this.setMessage = dataArtikel;
    res.status(200).json(this.getMessage);
  }
  

  //   post artikel
  async addArtikel(req, res) {
    const {
      title,
      author,
      publicationDate,
      lastUpdated,
      tags,
      categories,
      keywords,
      relatedArticles,
      content,
    } = req.body;

    // console.log(req.body);

    function splitText(text) {
      const trimText = text.trim();
      const splitText = trimText.split(",") || trimText.split(", ");
      return splitText;
    }

    blogs_model.create({
      title: title,
      author: author,
      publicationDate: publicationDate,
      lastUpdated: lastUpdated,
      tags: splitText(tags),
      categories: splitText(categories),
      keywords: splitText(keywords),
      relatedArticles: relatedArticles,
      content: content,
    });

    this.setMessage = "Berhasil menambahkan artikel.";
    res.status(201).json(this.getMessage);
  }

  // put artikel
  async updateArtikel(req, res) {
    const idArtikel = await this.getIdArtikel(req);
    if (!idArtikel) {
      this.setMessage = "Id artikel tidak ditemukan.";
      return this.getMessage;
    }

    const artikelData = { ...req.body };

    function splitText(text) {
      const trimText = text.trim();
      const splitText = trimText.split(",") || trimText.split(", ");
      return splitText;
    }

    artikelData["content"].map((item) =>
      idArtikel.create({
        title: artikelData["title"],
        slug: artikelData["slug"],
        author: artikelData["author"],
        publicationDate: artikelData["publicationDate"],
        lastUpdated: artikelData["lastUpdated"],
        tags: splitText(artikelData["tags"]),
        categories: splitText(artikelData["categories"]),
        keywords: splitText(artikelData["keywords"]),
        summary: artikelData["summary"],
        content: [item],
        relatedArticles: artikelData["linkArtikel"],
      })
    );

    this.setMessage = "Berhasil edit artikel.";
    res.status(200).json(this.getMessage);
  }

  // delete artikel
  async deleteArtikel(req, res) {
    const idArtikel = await this.getIdArtikel(req);

    if (!idArtikel) {
      this.setMessage = "Id artikel tidak ditemukan.";
      return this.getMessage;
    }
    idArtikel.destroy();

    this.setMessage = "Artikel berhasil dihapus.";
    res.status(200).json(this.getMessage);
  }
}

module.exports = { BlogsManage };
