const db = require("../../../libraries/databases/db.js");
const sequelize = require("sequelize");

const { DataTypes } = sequelize;
const wisataScheme = db.define(`${process.env.TB_WISATAWAN}`,{
  idWisata: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  idPesan: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      notEmpty: false,
    },
  },
  judul: {
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
  diskon: {
    type: DataTypes.FLOAT,
    allowNull: true,
    validate: {
      notEmpty: false,
    },
  },
  jenis: {
    type: DataTypes.JSON,
    defaultValue: {} ,
    allowNull: true,
    validate: {
      notEmpty: false,
    },
  },
  status: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    validate: {
      notEmpty: false,
    },
  },
  image: {
    type: DataTypes.JSON,
    defaultValue: {},
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
});

module.exports = wisataScheme;
