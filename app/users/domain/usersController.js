const userSchema = require("../data-access/usersSchema.js");

class ManagerUsers {
  constructor() {
    this.message = "";
  }

  get getMessage() {
    return this.message;
  }

  set setMessage(msg) {
    return (this.message = msg);
  }

  getIdUsers(req) {
    const { id, email, telp, name } = req.query;
    const whereData = {};

    if (id) whereData.idUsers = id;
    if (email) whereData.email = email;
    if (telp) whereData.telephone = telephone;
    if (name) whereData.fullName = fullname;

    return async () => {
      await userSchema.findOne({
        where: whereData,
      });
    };
  }

  async getUsers(res) {
    const dataUser = await userSchema.findAll();
    this.setNessage = dataUser;
    res.status(200).send(this.getMessage);
  }

  async getUsersById(req, res) {
    const dataIdUsers = this.getIdUsers(req);
    this.setNessage = dataIdUsers;
    res.status(200).send(this.getMessage);
  }

  async getUsersByTelephone(req, res) {
    const dataTelephoneUsers = this.getIdUsers(req);
    this.setNessage = dataTelephoneUsers;
    res.status(200).send(this.getMessage);
  }

  async getUsersByEmail(req, res) {
    const dataEmailUsers = this.getIdUsers(req);
    this.setNessage = dataEmailUsers;
    res.status(200).send(this.getMessage);
  }

  async getUsersByFullName(req, res) {
    const dataFullNameUsers = this.getIdUsers(req);
    this.setNessage = dataFullNameUsers;
    res.status(200).send(this.getMessage);
  }

  async addUsers(req, res) {
    const {
      fullname,
      email,
      telephone,
      dropUp: { dateUp, timeUp },
      dropOff: { dateOff, timeOff },
    } = req.body;

    await userSchema.create({
      fullName: fullname,
      email: email,
      telephone: telephone,
      dropUp: {
        dateUp: dateUp,
        timeUp: timeUp,
      },
      dropOff: {
        dateOff: dateOff,
        timeOff: timeOff,
      },
    });

    this.setMessage = { message: "Berhasil set data" };
    res.status(200).send(this.getMessage);
  }
}

module.exports = { ManagerUsers };
