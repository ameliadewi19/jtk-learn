'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class DetailHistoryQuiz extends Model {
        static associate(models) {
            DetailHistoryQuiz.belongsTo(models.HistoryQuiz, {
                foreignKey: 'id_history_quiz',
                as: 'history_quiz',
            });
            DetailHistoryQuiz.belongsTo(models.Pertanyaan, {
                foreignKey: 'id_pertanyaan',
                as: 'pertanyaan',
            });
            DetailHistoryQuiz.belongsTo(models.Jawaban, {
                foreignKey: 'id_jawaban',
                as: 'jawaban',
            });
        }
    }
    DetailHistoryQuiz.init(
        {
            id_detail_history_quiz: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            id_history_quiz: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            id_pertanyaan: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            id_jawaban: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            jawaban_text: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            status: {
                type: DataTypes.ENUM('benar', 'salah'),
                allowNull: false,
                defaultValue: 'salah',
            },
        },
        {
            sequelize,
            modelName: 'DetailHistoryQuiz',
            tableName: 'detailHistoryQuiz',
            timestamps: true,
        }
    );
    return DetailHistoryQuiz;
};