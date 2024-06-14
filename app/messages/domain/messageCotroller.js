const nodemailer = require("nodemailer");
const usersSchema = require("../../users/data-access/usersSchema.js");
const {
  EmailManager,
} = require("../../../libraries/authentication/senderEmail.js");

class ManageMessages {
  constructor() {
    this.messages = "";
  }

  get getMessage() {
    return this.messages;
  }

  set setMessage(msg) {
    this.messages = msg;
  }

  async sendMessageToMail(req, res) {
    try {
      const { resiver, judul, message, statusMessage } = req.body;

      if (statusMessage) {
        const userEmails = await usersSchema.findAll();

        if (!userEmails || userEmails.length === 0) {
          this.setMessage = {
            value: false,
            msg: "Data user tidak di temukan",
          };
          return res.json(this.getMessage);
        }

        const emails = await userEmails.map((data) => data.dataValues.email);

        const transportMailer = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });

        try {
          await emails.map((email) => {
            return transportMailer.sendMail({
              from: process.env.EMAIL_SENDER,
              subject: judul,
              to: email,
              html: `<div class="flex flex-col gap-2"><h1>${judul}</h1><p>${message}</p></div>`,
            });
          });
          this.setMessage = {
            value: true,
            msg: "Successfully mengirim pesan.",
          };
        } catch (err) {
          this.setMessage = {
            value: false,
            msg: "Gagal Mengirim pesan ke beberapa email.",
          };
        }

        return res.json(this.getMessage);
      } else {
        const emailManager = new EmailManager(
          process.env.EMAIL_SENDER,
          resiver,
          `
            <div>
              <h1>${judul}</h1>
              <p>${message}</p>
            </div>
          `
        );
        emailManager.manageEmail(req, res);
        this.setMessage = {
          value: true,
          msg: `Berhasil Kirim pesan ke ${resiver}`,
        };
        return res.json(this.getMessage);
      }
    } catch (error) {
      this.setMessage = {
        value: false,
        msg: "Gagal melakukan kirim pesan",
      };
      return res.json(this.getMessage);
    }
  }
}

module.exports = { ManageMessages };
