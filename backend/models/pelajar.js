'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Pelajar extends Model {
    static associate(models) {
      // Relasi dengan tabel User
      Pelajar.belongsTo(models.User, {
        foreignKey: 'id_user',
        as: 'user',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
    }
  }

  Pelajar.init(
    {
      id_pelajar: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      id_user: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      nama: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      nim: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      alamat: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      jenis_kelamin: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isIn: [['L', 'P']], // Validasi hanya "L" (Laki-laki) atau "P" (Perempuan)
        },
      },
    },
    {
      sequelize,
      modelName: 'Pelajar',
      tableName: 'pelajar',
      timestamps: true,
    }
  );

  return Pelajar;
};
