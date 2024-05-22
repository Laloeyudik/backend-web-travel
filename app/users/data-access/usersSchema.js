

const db = require("../../../libraries/databases/db.js");
const sequelize = require("sequelize");
const { DataTypes } = sequelize;

const usersSchema = db.define(`${process.env.TB_USERS}`, {
  idUsers: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  fullName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  telephone: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: false,
    },
  },
  dropUp: {
    type: DataTypes.JSON,
    defaultValue: {},
    allowNull: true,
    validate: {
      notEmpty: false,
    },
  },
  dropOff: {
    type: DataTypes.JSON,
    defaultValue: {},
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
});

module.exports = usersSchema;
