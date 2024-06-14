const nodemailer = require("nodemailer");
require("dotenv").config();
class EmailManager {
  constructor(sender, resiver, messageProduk) {
    this.sender = sender;
    this.resiver = resiver;
    this.messageProduk = messageProduk;
    this.message = "";
  }

  get getMessage() {
    return this.message;
  }

  set setMessage(msg) {
    return (this.message = msg);
  }

  manageEmail(req, res) {
    const transportMailer = nodemailer.createTransport({
      service: `gmail`,
      auth: {
        user: `${process.env.EMAIL_USER}`,
        pass: `${process.env.EMAIL_PASS}`,
      },
    });

    const option = {
      from: this.sender,
      to: this.resiver,
      subject: "Order Detail",
      html: `<h1>Services Information</h1><p>${this.messageProduk}</p>`,
    };

    transportMailer.sendMail(option, (err, info) => {
      if (err) {
        this.setMessage = "gagal kirim email";
        return res.json(this.getMessage);
      }
    });
  }
}

module.exports = { EmailManager };
