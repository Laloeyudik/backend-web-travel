const pdflib = require("pdf-lib");
const xlsx = require("xlsx");
const fs = require("fs");
const path = require("path");
const { PDFDocument, rgb } = require("pdf-lib");
const nodeCron = require("node-cron");
const usersSchema = require("../../users/data-access/usersSchema.js");
const documentSchema = require("../data-access/documentSchema.js");
const uuid = require("uuid");
const { now } = require("sequelize/lib/utils");
const schedule = require("node-schedule");

class ManageDocument {
  constructor() {
    this.message = "";
  }

  get getMessage() {
    return this.message;
  }

  set setMessage(msg) {
    return (this.message = msg);
  }

  async getDownloadDocument(req, res) {
    try {
      const getDoc = await documentSchema.findOne({
        where: {
          idDocument: req.query.id,
        },
      });

      res
        .download(getDoc.path, getDoc.file, (err) => {
          if (err) {
            this.setMessage = {
              value: false,
              msg: `Gagal melakukan download file excel`,
            };
            res.json(this.getMessage);
          }
        })
        .json("successfully download file");

      // this.setMessage = {
      //   value: true,
      //   msg: `succesfully download file excel`,
      // };
      res.json(this.getMessage);
    } catch (error) {
      if (error) {
        this.setMessage = {
          value: false,
          msg: `sistem Error, tidak dapat melakukan download file excel`,
        };
      }
    }
  }

  // async createPdfDocument(req, res) {
  //   try {
  //     const dataUser = await usersSchema.findAll();
  //     const dataUsers = await dataUser.map((user) => user.dataValues);
  //     const pdfDoc = await PDFDocument.create();
  //     const page = pdfDoc.addPage();
  //     page.drawText(JSON.stringify(dataUsers, null, 2), {
  //       x: 50,
  //       y: 700,
  //       size: 12,
  //       color: rgb(0, 0, 0),
  //     });
  //     const namaFile = uuid.v4();
  //     const type = ["pdf", "PDF"];
  //     const formatName = `${namaFile}.${type[0]}`;
  //     const pathFile = path.join(
  //       __dirname,
  //       `../../../upload/document/${formatName}`
  //     );
  //     const pdfBytes = await pdfDoc.save()
  //     fs.writeFileSync(pathFile, pdfBytes)

  //     this.setMessage = {value: true, msg: `Berhasil cereate pdf file`}
  //     res.json(this.getMessage)
  //   } catch (error) {
  //     if (error) {
  //       console.log(error);
  //       this.setMessage = { value: false, msg: "Gagal memmbuat document pdf" };
  //       res.json(this.getMessage);
  //     }
  //   }
  // }

  async createExcelDocument(req, res) {
    try {
      const users = await usersSchema.findAll();
      const dataUsers = await users.map((user) => user.dataValues);

      const workbook = xlsx.utils.book_new();
      const workSheet = xlsx.utils.json_to_sheet(dataUsers);
      xlsx.utils.book_append_sheet(workbook, workSheet, "Sheet1");

      const namaFile = uuid.v4();
      const type = ["xlsx", "csv"];
      const formatName = `${namaFile}.${type[0]}`;

      const dates = new Date().toISOString();

      const pathFile = path.join(
        __dirname,
        `../../../upload/document/${formatName}`
      );

      console.log(pathFile);
      xlsx.writeFile(workbook, pathFile);

      const dataDocumet = await documentSchema.create({
        file: formatName,
        path: pathFile,
        date: dates,
      });

      this.scheduleFileDeletion(pathFile, dataDocumet.file);

      this.setMessage = { value: true, msg: `Succesfully create file excel` };
      res.json(this.getMessage);
    } catch (error) {
      if (error) {
        this.setMessage = { value: false, msg: "Gagal membuat documen excel" };
        res.json(this.getMessage);
      }
    }
  }

  scheduleFileDeletion = async (filePath, fileName) => {
    const deleteDate = new Date(Date.now() + 1 * 60 * 1000);

    schedule.scheduleJob(deleteDate, () => {
      fs.unlink(filePath, async (err) => {
        if (err) {
          if (err) {
            this.setMessage = {
              value: false,
              msg: `Gagal deleting file ${fileName}`,
            };
            this.getMessage;
          }
        } else {
          const documentDownload = await documentSchema.findOne({
            where: {
              file: fileName,
            },
          });

          if (documentDownload) {
            return documentDownload.destroy();
          }

          this.setMessage = {
            value: false,
            msg: `File ${fileName} delete successfully`,
          };
          this.getMessage;
        }
      });
    });
  };
}

module.exports = { ManageDocument };
