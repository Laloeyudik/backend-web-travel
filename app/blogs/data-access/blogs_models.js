const db = require("../../../libraries/databases/db.js");
const sequelize = require("sequelize");

const { DataTypes } = sequelize;
const blogs = db.define(`${process.env.TB_BLOGS}`, {
  id_blog: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  title: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      notEmpty: false,
    },
  },
  author: {
    type: DataTypes.JSON,
    defaultValue: {},
    allowNull: true,
    validate: {
      notEmpty: false,
    },
  },
  
  publicationDate: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      notEmpty: false,
    },
  },
  lastUpdated: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      notEmpty: false,
    },
  },
  tags: {
    type: DataTypes.JSON,
    defaultValue: [],
    allowNull: true,
    validate: {
      notEmpty: false,
    },
  },
  categories: {
    type: DataTypes.JSON,
    defaultValue: [],
    allowNull: true,
    validate: {
      notEmpty: false,
    },
  },
  keywords: {
    type: DataTypes.JSON,
    defaultValue: [],
    allowNull: true,
    validate: {
      notEmpty: false,
    },
  },
  // image: {
  //   type: DataTypes.STRING,
  //   validate: {
  //     notEmpty: false,
  //   },
  // },

  content: {
    type: DataTypes.JSON,
    defaultValue: [],
    allowNull: true,
    validate: {
      notEmpty: false,
    },
  },
  relatedArticles: {
    type: DataTypes.JSON,
    defaultValue: [],
    allowNull: true,
    validate: {
      notEmpty: false,
    },
  } 
});

module.exports = blogs;

