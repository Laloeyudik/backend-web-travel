// import {CronJob} from 'cron'
const { CronJob } = require("cron");
const fs = require("fs");
const path = require("path");

const folderPath = path.join(__dirname, "../../private/");
const job = new CronJob(
  "* * * * *",
  () => clearFolder(folderPath),
  null,
  true,
  "Asia/Jakarta"
);

function clearFolder(folderPath) {
  fs.readdir(folderPath, (err, files) => {
    if (err) return {
        msg: `${err.message}`
    };

    for (const file of files) {
      const filePath = path.join(folderPath, file);
      fs.lstat(filePath, (err,stats) => {
       if (err) return {
        msg: `${err.message}`
       }
        if (stats.isDirectory()) {
          clearFolder(filePath);
          fs.rmdir(filePath, (err) => {
            if (err) return {
                msg: `${err.message}`
            };
          });
        } else {
          return fs.unlinkSync(filePath, (err) => {
            if (err) return {
                msg: `${err.message}`
            }
          });
        }
      });
    }
  });
}
module.exports = job

