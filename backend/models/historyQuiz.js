'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class HistoryQuiz extends Model {
        // relasi dengan tabel quiz dan pelajar
        static associate(models) {
            HistoryQuiz.belongsTo(models.Quiz, {
                foreignKey: 'id_quiz',
                as: 'quiz',
            });
            HistoryQuiz.belongsTo(models.Pelajar, {
                foreignKey: 'id_pelajar',
                as: 'pelajar',
            });
        }
    }
    HistoryQuiz.init(
        {
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
            id_pelajar: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'pelajar',
                    key: 'id_pelajar',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            waktu_mulai: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            waktu_selesai: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            nilai: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: 'HistoryQuiz',
            tableName: 'historyQuiz',
            timestamps: true,
        }
    );
    return HistoryQuiz;
};