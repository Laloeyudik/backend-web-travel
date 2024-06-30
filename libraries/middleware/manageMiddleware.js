const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

class ManageMiddleware {
  constructor() {
    this.message = "";
  }

  get getMessage() {
    return this.message;
  }

  set setMessage(msg) {
    return (this.message = msg);
  }

  authJudul(judul) {
    const regExp = /^[a-zA-Z0-9\s]+$/;
    if (judul == undefined || judul == null) {
      this.setMessage = "Judul tidak boleh kosong";
      return this.getMessage;
    } else {
      if (regExp.test(judul)) {
        return { value: true, data: judul };
      } else {
        this.setMessage = {
          value: false,
          msg: `Format judul tidak sesuai, masukan a-zA-Z0-9`,
        };
        return this.getMessage;
      }
    }
  }

  authFullname(fullname) {
    const regex = /^[a-zA-Z\s]{3,100}$/;
    const fullnameRegex = regex.test(fullname);

    if (fullnameRegex) {
      const trimFullName = fullname.trim();
      if (/\s{2,}/.test(trimFullName)) {
        this.setMessage = {
          value: false,
          msg: "Tidak boleh spasi terlalu banyak",
        };
        return this.getMessage;
      }
      return { value: true, data: fullname };
    }

    if (!fullnameRegex) {
      this.setMessage = {
        value: false,
        msg: "fullname not valid, masukan min.3 max.100, a-z, A-Z",
      };
      return this.getMessage;
    }
  }

  authUsername(username) {
    const regex = /^[a-zA-Z0-9_.]{5,27}$/;
    if (regex.test(username) && !/\s/.test(username)) {
      return { value: true, data: username };
    } else {
      this.setMessage = {
        value: false,
        msg: "Username harus bernilai a-z, A-Z, 0-9, _, & tidak spasi",
      };
      return this.getMessage;
    }
  }

  authEmail(email) {
    const domainEmail = process.env.DOMAIN_EMAIL;
    const verifyEmail = email.split("@")[1];
    if (domainEmail.includes(verifyEmail)) {
      return { value: true, data: email };
    } else {
      this.setMessage = {
        value: false,
        msg: "Masukan email yang valid !, ex: axample@gmail.com",
      };
      return this.getMessage;
    }
  }

  authTelephone(telephone) {
    const regex13 = /^\d{2}-\d{4}-\d{4}-\d{3}|\d{13}$/;
    const regex12 = /^\d{4}-\d{4}-\d{4}|\d{12}$/;
    const regex11 = /^\d{4}-\d{4}-\d{3}|\d{11}$/;

    if (
      (regex11.test(telephone) && telephone.length == 11) ||
      (regex12.test(telephone) && telephone.length == 12) ||
      (regex13.test(telephone) && telephone.length == 13)
    ) {
      return { value: true, data: telephone };
    } else {
      this.setMessage = {
        value: false,
        msg: "Masukan telephone 0-9, yang valid !",
      };
      return this.getMessage;
    }
  }

  authDate(date) {
    console.log(typeof date);
    const regExp = /^[a-zA-Z0-9-/]+$/;
    if (date === null ) {
      return { value: true, data: date };
    } else if (!regExp.test(date)) {
      this.setMessage = { value: false, msg: "Date is not valid" };
      return this.getMessage;
    } else {
      return { value: true, data: date };
    }
  }

  authTime(time) {
    console.log(typeof time);
    const regExp = /^[0-9:]+$/;
    if (time === null ) {
      return { value: true, data: time };
    } else if (!regExp.test(time)) {
      this.setMessage = { value: false, msg: "Time is not valid" };
      return this.getMessage;
    } else {
      return { value: true, data: time };
    }
  }

  generateToken(idData, usernameData) {
    const payload = {
      id: idData,
      username: usernameData,
    };
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "20s",
    });
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
      expiresIn: "1d",
    });

    return { id: idData, accessToken: accessToken, refreshToken: refreshToken };
  }

  validateToken(token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      return { valid: true, data: decoded };
    } catch (err) {
      return {
        valid: false,
        message: "Maaf access terlarang!, silahkan login ulang. ",
      };
    }
  }

  authPassword(password) {
    const reqExp = /^[a-zA-Z0-9@_$!]{8,27}$/;
    const isStrong = reqExp.test(password);
    const noSpace = !/\s/.test(password);
    if (isStrong && noSpace) {
      const hash = bcrypt.hashSync(password, 12);
      return { value: true, data: hash };
    }
    this.setMessage = {
      value: false,
      msg: "Masukan password min.8,a-z,A-Z,0-9,@,_,$,!, dan tidak spasi/ kosong",
    };
    return this.getMessage;
  }
}

module.exports = { ManageMiddleware };
