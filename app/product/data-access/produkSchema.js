
const db = require("../../../libraries/databases/db.js");
const { DataTypes } = require("sequelize");

const produkSchema = db.define(`${process.env.TB_PRODUK }`, {
  idProduk: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  judul: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  harga: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  jenisHarga: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  deskripsi: {
    type: DataTypes.JSON,
    defaultValue: {},
    allowNull: false,
    validate: {
      notEmpty: false,
    },
  },
  varian: {
    type: DataTypes.JSON,
    defaultValue: [],
    allowNull: true,
    validate: {
      notEmpty: false,
    },
  },
  kategori: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      notEmpty: false,
    },
  },
  diskon: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      notEmpty: false,
    },
  },
  stock: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    allowNull: true,
    validate: {
      notEmpty: false,
    },
  },
  min: {
    type: DataTypes.STRING,
    defaultValue: 0,
    allowNull: true,
    validate: {
      notEmpty: false,
    },
  },
  max: {
    type: DataTypes.STRING,
    defaultValue: 0,
    allowNull: true,
    validate: {
      notEmpty: false,
    },
  },
  statusBooking: {
    type: DataTypes.STRING,
    defaultValue: "Open",
    allowNull: false,
    validate: {
      notEmpty: false,
    },
  },
  image: {
    type: DataTypes.JSON,
    defaultValue: [],
    allowNull: true,
    validate: {
      notEmpty: false,
    },
  },
});

module.exports = produkSchema;
