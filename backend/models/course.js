'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Course extends Model {
    static associate(models) {
      // Relasi dengan tabel pengajar
      Course.belongsTo(models.Pengajar, {
        foreignKey: 'id_pengajar',
        as: 'pengajar', // Pastikan alias ini sesuai dengan apa yang dipakai di query
      });      
    }
  }
  Course.init(
    {
      id_course: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      id_pengajar: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'pengajar',
          key: 'kode_dosen',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      nama_course: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      enrollment_key: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      gambar_course: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      deskripsi: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'Course',
      tableName: 'course',
      timestamps: true, // Untuk createdAt dan updatedAt
    }
  );
  return Course;
};
