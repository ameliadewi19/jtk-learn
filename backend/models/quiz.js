'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Quiz extends Model {
        static associate(models) {
            // Relasi dengan tabel course
            Quiz.belongsTo(models.Course, {
                foreignKey: 'id_course',
                as: 'course', // Pastikan alias ini sesuai dengan apa yang dipakai di query
            });
        }
    }
    Quiz.init(
        {
            id_quiz: {
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
            nama_quiz: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            deskripsi_quiz: {
                type: Sequelize.TEXT,
                allowNull: false,
            },
            durasi: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: 'Quiz',
            tableName: 'quiz',
            timestamps: true, // Untuk createdAt dan updatedAt
        }
    );
    return Quiz;
};