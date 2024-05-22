
const db = require("../../../libraries/databases/db.js");
const { DataTypes } = require("sequelize");

const reviewSchema = db.define(`${process.env.TB_REVIEWS}`, {
  idReview: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  name: {
    type: DataTypes.STRING,
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
  image: {
    type: DataTypes.JSON,
    defaultValue: [],
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
});

module.exports = reviewSchema;
