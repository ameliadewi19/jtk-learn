'use strict';
const { Model } = require('sequelize');
const sequelize = require('../config/connection');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // Tambahkan relasi di sini jika ada
    }
  }

  User.init(
    {
      id_user: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isIn: [['pelajar', 'pengajar']], // Validasi nilai role
        },
      },
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'users',
      timestamps: true, // Otomatis mengelola createdAt dan updatedAt
    }
  );

  return User;
};
