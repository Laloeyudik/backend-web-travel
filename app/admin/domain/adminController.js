// const Cookies = require("cookies");
// const {
//   ManageMiddleware,
// } = require("../../../libraries/middleware/manageMiddleware.js");
// const adminSchema = require("../data-access/adminSchema.js");
// const bcrypt = require("bcrypt");

// class ManageAdmin {
//   #middleware = new ManageMiddleware();

//   constructor() {
//     this.message = "";
//   }

//   get getMessage() {
//     return this.message;
//   }

//   set setMessage(msg) {
//     this.message = msg;
//   }

//   getAdmin(req, res) {
//     res.json("Halo Guys");
//   }

//   async createAdmin(req, res) {
//     const { username, password, role } = req.body;
//     const middUsername = this.#middleware.authUsername(username);
//     const middPassword = this.#middleware.authPassword(password);

//     if (middUsername.value && middPassword.value) {
//       await adminSchema.create({
//         username: middUsername.data,
//         password: middPassword.data,
//         role: role || false,
//       });
//       this.setMessage =
//         "Berhasil buat admin baru, silahkan login dan jangan berikan siapa-siapa";
//       res.status(200).json(this.getMessage);
//     } else {
//       res.status(400).json(this.getMessage);
//     }
//   }

//   async loginAdmin(req, res) {
//     const { username, password } = req.body;
//     const middUsername = this.#middleware.authUsername(username);
//     const middPassword = this.#middleware.authPassword(password);

//     if (middUsername.value === false || middPassword.value === false) {
//       this.setMessage = middUsername.msg || middPassword.msg;
//       return res.status(401).json(this.getMessage);
//     }

//     const admin = await adminSchema.findOne({
//       where: { username: middUsername.data },
//     });

//     if (!admin) {
//       this.setMessage = "Username tidak ditemukan";
//       return res.status(401).json(this.getMessage);
//     }

//     const isValidPassword = bcrypt.compareSync(password, admin.password);
//     if (!isValidPassword) {
//       this.setMessage = "Password salah";
//       return res.status(401).json(this.getMessage);
//     }

//     const token = this.#middleware.generateToken(admin.idAdmin);
//     // const cookies = new Cookies(req, res);
//     // cookies.set("authToken", token,  { httpOnly: true, secure: false, sameSite: 'None' , signed: true });

//     const cookies = new Cookies(req, res);
//     cookies.set("authToken", token, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV_COOKIES !== "production",
//       sameSite: "Lax",
//     });

//     this.setMessage = "Login berhasil";
//     res.status(200).json({ message: this.getMessage });
//   }

//   logoutAdmin(req, res) {
//     // const cookies = new Cookies(req, res);
//     // cookies.set("authToken", null, { httpOnly: true });

//     const cookies = new Cookies(req, res);
//     cookies.set("authToken", "", {
//       httpOnly: true,
//       secure: process.env.NODE_ENV_COOKIES !== "production",
//       sameSite: "Lax",
//       expires: new Date(0),
//     });

//     this.setMessage = "Logout berhasil";
//     res.status(200).json(this.getMessage);
//   }

//   async checkLoginStatus(req, res) {
//     const cookies = new Cookies(req, res);
//     const token = cookies.get("authToken");

//     if (!token) {
//       return res
//         .status(401)
//         .json({ loggedIn: false, message: "Not logged in" });
//     }
//     try {
//       const decoded = this.#middleware.validateToken(token);
//       const admin = await adminSchema.findByPk(decoded.data);

//       if (admin) {
//         res.status(200).json({ loggedIn: true, id: admin.idAdmin });
//       } else {
//         res.status(401).json({ loggedIn: false, message: "Invalid token" });
//       }
//     } catch (error) {
//       res.status(401).json({ loggedIn: false, message: "Invalid token" });
//     }
//   }
// }

// module.exports = { ManageAdmin };

const Cookies = require("cookies");
const {
  ManageMiddleware,
} = require("../../../libraries/middleware/manageMiddleware.js");
const adminSchema = require("../data-access/adminSchema.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

class ManageAdmin {
  #middleware = new ManageMiddleware();

  constructor() {
    this.message = "";
  }

  get getMessage() {
    return this.message;
  }

  set setMessage(msg) {
    this.message = msg;
  }

  getAdmin(req, res) {
    res.json("Halo Guys");
  }

  async createAdmin(req, res) {
    const { username, email, password } = req.body;
    const middUsername = this.#middleware.authUsername(username);
    const middEmail = this.#middleware.authEmail(email);
    const middPassword = this.#middleware.authPassword(password);

    if (
      middUsername.value === true &&
      middEmail.value === true &&
      middPassword.value === true
    ) {
      await adminSchema.create({
        username: middUsername.data,
        email: middEmail.data,
        password: middPassword.data,
      });
      this.setMessage =
        "Berhasil buat admin baru, silahkan login dan jaga privasi anda";
      res.status(200).json(this.getMessage);
    } else {
      this.setMessage = "Gagal Membuat admin";
      return res.status(400).json(this.getMessage);
    }
  }

  async loginAdmin(req, res) {
    try {
      const middEmail = this.#middleware.authEmail(req.body.email);

      if (middEmail.value === false) {
        this.setMessage = middEmail.msg;
        return res.status(401).json(this.getMessage);
      }

      const admin = await adminSchema.findAll({
        where: { email: middEmail.data },
      });

      if (!admin) {
        this.setMessage = "Username tidak ditemukan";
        return res.status(401).json(this.getMessage);
      }

      const isValidPassword = bcrypt.compareSync(
        req.body.password,
        admin[0].password
      );
      if (!isValidPassword) {
        this.setMessage = "Password salah, masukan password yang benar";
        return res.status(401).json(this.getMessage);
      }

      const { id, accessToken, refreshToken } = this.#middleware.generateToken(
        admin[0].idAdmin,
        admin[0].username
      );

      await adminSchema.update(
        {
          refreshToken: refreshToken,
        },
        {
          where: {
            idAdmin: id,
          },
        }
      );

      res.cookie("authToken", refreshToken, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
        secure: process.env.NODE_ENV_COOKIES === "production",
        sameSite: "Lax",
      });
      this.setMessage = { msg: "Login berhasil", accessToken: accessToken };
      res.status(200).json(this.getMessage);
    } catch (error) {
      if (error) {
        this.setMessage = { msg: "Terjadi kesalhan sistem!" };
        return res.json(this.getMessage);
      }
    }
  }

  async logoutAdmin(req, res) {
    const token = req.cookies.authToken;

    if (!token) return res.status(204);

    const admin = await adminSchema.findAll({
      where: {
        refreshToken: token,
      },
    });

    if (!admin[0]) return res.status(204);

    await adminSchema.update(
      {
        refreshToken: null,
      },
      {
        where: {
          idAdmin: admin[0].idAdmin,
        },
      }
    );
    res.clearCookie("authToken");

    this.setMessage = "Logout berhasil";
    res.status(200).json(this.getMessage);
  }

  async checkLoginStatus(req, res) {
    const cookies = new Cookies(req, res);
    const token = cookies.get("authToken");

    if (!token) {
      return res
        .status(401)
        .json({ loggedIn: false, message: "Not logged in" });
    }
    try {
      const decoded = this.#middleware.validateToken(token);
      const admin = await adminSchema.findByPk(decoded.data);

      if (admin) {
        res.status(200).json({ loggedIn: true, id: admin.idAdmin });
      } else {
        res.status(401).json({ loggedIn: false, message: "Invalid token" });
      }
    } catch (error) {
      res.status(401).json({ loggedIn: false, message: "Invalid token" });
    }
  }

  async refreshToken(req, res) {
    try {
      const token = req.cookies.authToken;
      if (!token) return res.status(401);

      const admin = await adminSchema.findAll({
        where: {
          refreshToken: token,
        },
      });

      if (!admin[0]) return res.status(403);

      jwt.verify(token, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
        if (err) return res.status(403);

        const payload = {
          id: admin[0].idAdmin,
          username: admin[0].username,
        };

        const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
          expiresIn: "15s",
        });
        this.setMessage = { accessToken: accessToken };

        res.status(200).json(this.getMessage);
      });
    } catch (error) {
      if (error) {
        console.log(error);
      }
    }
  }
}

module.exports = { ManageAdmin };
