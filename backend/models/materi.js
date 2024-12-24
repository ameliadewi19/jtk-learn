'use strict'
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Materi extends Model {
        static associate(models) {
            // Relasi dengan tabel course
            Materi.belongsTo(models.Course, {
                foreignKey: 'id_course',
                as: 'course', // Pastikan alias ini sesuai dengan apa yang dipakai di query
            });
        }
    }
    Materi.init(
        {
            id_materi: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            id_course: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'course',
                    key: 'id_course',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            nama_materi: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            konten_materi: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            jenis_materi: {
                type: Sequelize.ENUM('teks', 'video'),
                allowNull: true,
            },
        },
        {
            sequelize,
            modelName: 'Materi',
            tableName: 'materi',
            timestamps: true, // Untuk createdAt dan updatedAt
        }
    );
    return Materi;
};