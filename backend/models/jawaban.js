'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Jawaban extends Model {
        static associate(Models) {
            // Relasi dengan tabel pertanyaan
            Jawaban.belongsTo(Models.Pertanyaan, {
                foreignKey: 'id_pertanyaan',
                as: 'pertanyaan', // Pastikan alias ini sesuai dengan apa yang dipakai di query
            });
        }
    }
    Jawaban.init(
        {
            id_jawaban: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            id_pertanyaan: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'pertanyaan',
                    key: 'id_pertanyaan',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            nama_jawaban: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            konten_jawaban: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            status_jawaban: {
                type: DataTypes.ENUM('benar', 'salah'),
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: 'Jawaban',
            tableName: 'jawaban',
            timestamps: true, // Untuk createdAt dan updatedAt
        }
    );
    return Jawaban;
};