const xlsx = require("xlsx")
const fs = require("fs")

const workBook = xlsx.readFile("uploadMasalProduk.xlsx")
const sheetNames = workBook.SheetNames[0]
const workSheet = workBook.Sheets[sheetNames]

console.log(workSheet);