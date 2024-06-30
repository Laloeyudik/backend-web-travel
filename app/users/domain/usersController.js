const {
  EmailManager,
} = require("../../../libraries/authentication/senderEmail.js");
const {
  ManageMiddleware,
} = require("../../../libraries/middleware/manageMiddleware.js");
const userSchema = require("../data-access/usersSchema.js");

class ManagerUsers {
  #manageMiddleware = new ManageMiddleware();

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

  async getUsers(req, res) {
    const { page = 1, limit = 10 } = req.query;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const dataUser = await userSchema.findAll();
    this.setMessage = {
      datas: dataUser.slice(startIndex, endIndex),
      pages: page,
      totalPages: Math.ceil(dataUser.length / limit),
      totalUsers: dataUser.length
    };
    res.status(200).json(this.getMessage);
  }

  async getUsersById(req, res) {
    const dataIdUsers = this.getIdUsers(req);
    this.setMessage = dataIdUsers;
    res.status(200).send(this.getMessage);
  }

  async getUsersByTelephone(req, res) {
    const dataTelephoneUsers = this.getIdUsers(req);
    this.setMessage = dataTelephoneUsers;
    res.status(200).send(this.getMessage);
  }

  async getUsersByEmail(req, res) {
    const dataEmailUsers = this.getIdUsers(req);
    this.setMessage = dataEmailUsers;
    res.status(200).send(this.getMessage);
  }

  async getUsersByFullName(req, res) {
    const dataFullNameUsers = this.getIdUsers(req);
    this.setMessage = dataFullNameUsers;
    res.status(200).send(this.getMessage);
  }

  async addUsers(req, res) {
    const {
      fullname,
      email,
      telephone,
      dropUp: { dateUp, timeUp  },
      dropOff: { dateOff , timeOff },
    } = req.body;

    const authFullname = await this.#manageMiddleware.authFullname(fullname);
    const authEmail = await this.#manageMiddleware.authEmail(email);
    const authTelephone = await this.#manageMiddleware.authTelephone(telephone);
    const authDateUp = await this.#manageMiddleware.authDate(dateUp);
    const authDateOff = await this.#manageMiddleware.authDate(dateOff);
    const authTimeOff = await this.#manageMiddleware.authTime(timeOff);
    const authTimeUp = await this.#manageMiddleware.authTime(timeUp);

    if (authFullname.value === false) {
      this.setMessage = authFullname;
      return res.json(this.getMessage);
    }

    if (authEmail.value === false) {
      this.setMessage = authEmail;
      return res.json(this.getMessage);
    }

    if (authTelephone.value === false) {
      this.setMessage = authTelephone;
      return res.json(this.getMessage);
    }

    if (authDateUp.value === false) {
      this.setMessage = authDateUp;
      return res.json(this.getMessage);
    }

    if (authDateOff.value === false) {
      this.setMessage = authDateOff;
      return res.json(this.getMessage);
    }

    if (authTimeUp.value === false) {
      this.setMessage = authTimeUp;
      return res.json(this.getMessage);
    }

    if (authTimeOff.value === false) {
      this.setMessage = authTimeOff;
      return res.json(this.getMessage);
    }

    await userSchema.create({
      fullName: authFullname.data,
      email: authEmail.data,
      telephone: authTelephone.data,
      dropUp: {
        dateUp: authDateUp.data,
        timeUp: authTimeUp.data,
      },
      dropOff: {
        dateOff: authDateOff.data,
        timeOff: authTimeOff.data,
      },
    });

    const emailManager = new EmailManager(
      process.env.EMAIL_SENDER,
      process.env.EMAIL_RESIVER,
      `<ul>
        <li>Name: ${authFullname.data}</li>
        <li>Email: ${authEmail.data}</li>
        <li>Telephone: ${authTelephone.data}</li>
        <li>DropUp: ${authDateUp.data} - ${authTimeUp.data}</li>
        <li>DropOff: ${authDateOff.data} - ${authTimeOff.data}</li>
      </ul>`
    );

    emailManager.manageEmail(req, res);
    this.setMessage = { message: "Konfirmasi booking is success" };
    res.status(200).send(this.getMessage);
  }

  async updateUsers(req, res) {
    try {
      const idUsers = await userSchema.findOne({
        where: {
          idUsers: req.query.id,
        },
      });

      if (!idUsers || idUsers === "null" || idUsers === "undifined") {
        this.getMessage = { value: false, msg: "id users tidak ditemukan" };
        return res.json(this.getMessage);
      }

      const {
        fullname,
        email,
        telephone,
        dropUp: { dateUp, timeUp },
        dropOff: { dateOff, timeOff },
      } = req.body;

      const authFullname = await this.#manageMiddleware.authFullname(fullname);
      const authEmail = await this.#manageMiddleware.authEmail(email);
      const authTelephone = await this.#manageMiddleware.authTelephone(
        telephone
      );
      const authDateUp = await this.#manageMiddleware.authDate(dateUp);
      const authDateOff = await this.#manageMiddleware.authDate(dateOff);
      const authTimeOff = await this.#manageMiddleware.authTime(timeOff);
      const authTimeUp = await this.#manageMiddleware.authTime(timeUp);

      if (authFullname.value === false) {
        this.setMessage = authFullname;
        return res.json(this.getMessage);
      }

      if (authEmail.value === false) {
        this.setMessage = authEmail;
        return res.json(this.getMessage);
      }

      if (authTelephone.value === false) {
        this.setMessage = authTelephone;
        return res.json(this.getMessage);
      }

      if (authDateUp.value === false) {
        this.setMessage = authDateUp;
        return res.json(this.getMessage);
      }

      if (authDateOff.value === false) {
        this.setMessage = authDateOff;
        return res.json(this.getMessage);
      }

      if (authTimeUp.value === false) {
        this.setMessage = authTimeUp;
        return res.json(this.getMessage);
      }

      if (authTimeOff.value === false) {
        this.setMessage = authTimeOff;
        return res.json(this.getMessage);
      }

      await idUsers.update({
        fullName: authFullname.data,
        email: authEmail.data,
        telephone: authTelephone.data,
        dropUp: {
          dateUp: authDateUp.data,
          timeUp: authTimeUp.data,
        },
        dropOff: {
          dateOff: authDateOff.data,
          timeOff: authTimeOff.data,
        },
      });
    } catch (error) {
      if (error) {
        this.setMessage = { value: false, msg: "Gagal Melakukan Update" };
        return res.json(this.getMessage);
      }
    }
  }

  async deleteUsers(req, res) {
    try {
      const idUsers = await userSchema.findOne({
        where: {
          idUsers: req.query.id,
        },
      });

      if (!idUsers || idUsers == "null" || idUsers == "undifined") {
        this.setMessage = { value: false, msg: "Id users tidak ditemukan" };
        return res.json(this.getMessage);
      }

      await idUsers.distroy();

      this.setMessage = { value: true, msg: "Berhasil delete users" };
      return res.json(this.getMessage);
    } catch (error) {
      if (error) {
        this.setMessage = { value: false, msg: "Gagal melakukan delete users" };
        return res.json(this.getMessage);
      }
    }
  }
}

module.exports = { ManagerUsers };
