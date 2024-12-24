'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Pengajar extends Model {
    static associate(models) {
      // Relasi dengan tabel User
      Pengajar.belongsTo(models.User, {
        foreignKey: 'id_user',
        as: 'user',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
      Pengajar.hasMany(models.Course, {
        foreignKey: 'id_pengajar',
        as: 'courses',
      });      
    }
  }

  Pengajar.init(
    {
      kode_dosen: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      id_user: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      nip: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      nama: {
        type: DataTypes.STRING,
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
      modelName: 'Pengajar',
      tableName: 'pengajar',
      timestamps: true,
    }
  );

  return Pengajar;
};
