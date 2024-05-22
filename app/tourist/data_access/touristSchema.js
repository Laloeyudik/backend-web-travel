
const db = require("../../../libraries/databases/db.js");
const sequelize = require("sequelize");
const usersSchema = require("../../users/data-access/usersSchema.js");

const { DataTypes } = sequelize;

const touristSchema = db.define(`${process.env.TB_TOURIST}`, {
  idTourist: {
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
  price: {
    type: DataTypes.JSON,
    defaultValue: {},
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
    type: DataTypes.JSON,
    defaultValue: [],
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

usersSchema.hasMany(touristSchema, { foreignKey: "idUsers" });
touristSchema.belongsTo(usersSchema, { foreignKey: "idUsers" });

module.exports = touristSchema;
