'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Pertanyaan extends Model {
        // relasi dengan tabel quiz
        static associate(models) {
            Pertanyaan.belongsTo(models.Quiz, {
                foreignKey: 'id_quiz',
                as: 'quiz',
            });
        }
    }
    Pertanyaan.init(
        {
            id_pertanyaan: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            id_quiz: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'quiz',
                    key: 'id_quiz',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            nama_pertanyaan: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            konten_pertanyaan: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            jenis_pertanyaan: {
                type: DataTypes.ENUM('pilihan_ganda', 'jawaban_singkat', 'operasi_matematika'),
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: 'Pertanyaan',
            tableName: 'pertanyaan',
            timestamps: true, // untuk cretaedAt dan updatedAt
        }
    );
    return Pertanyaan;
};