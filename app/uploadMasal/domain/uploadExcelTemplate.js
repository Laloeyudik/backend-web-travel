const xlsx = require("xlsx");
const fs = require("fs");
const path = require("path");

class UploadExcelTemplate {
  constructor() {
    this.message = "";
  }

  get getMessage() {
    return this.message;
  }

  set setMessage(msg) {
    return (this.message = msg);
  }

  getExcelFile(req, res) {
    try {
      const user = [
        {
          fullname: "Jaya Sukonco",
          email: "yyyy@gmail.com",
          phone: "0986363663",
        },
        {
          fullname: "Jaya Sukonco 1",
          email: "yyyy@gmail.com",
          phone: "0986363663",
        },
        {
          fullname: "Jaya Sukonco 2",
          email: "yyyy@gmail.com",
          phone: "0986363663",
        },
      ];

     const userMap =  user.map((item, i)=> {
        const workbook = xlsx.writeFile(item[i], "data_01",{bookType:"xlsx", password:"123", type: "array" } );
        console.log(workbook, "aku workbook");
      })
      
    //   sheetName = workbook.SheetNames[0];
    //   const sheets = workbook.Sheets[sheetName];

    

      console.log(userMap, 'aku eser map');
      // const workbook =  xlsx.readFile(path.join(__dirname, "../../../upload/public/UploadMasalScooterKutaLombokRans1.xlsx"))
      // const sheetName = workbook.SheetNames[0]
      // const sheets = workbook.Sheets[sheetName]

      // const datas = xlsx.utils.sheet_to_json(sheets)

      // console.log(datas);
      res.json("Halo Guyss");
    } catch (error) {
      console.log(error.message);
    }
  }

  uploadExcelTemplate(req, res) {
    const workbook = xlsx.readFile(req.files);
    console.log(workbook);
  }
}

module.exports = { UploadExcelTemplate };
