const db = require("../../../libraries/databases/db.js");
const sequelize = require("sequelize");
const { DataTypes } = sequelize;

const documentSchema = db.define(`${process.env.TB_DOCUMENT}`, {
  idDocument: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  file: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  path: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  date: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
 
});

module.exports = documentSchema;
