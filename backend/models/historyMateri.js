'use strict';

const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class HistoryMateri extends Model {
        // relasi dengan tabel materi dan pelajar
        static associate(models) {
            HistoryMateri.belongsTo(models.Materi, {
                foreignKey: 'id_materi',
                as: 'materi',
            });
            HistoryMateri.belongsTo(models.Pelajar, {
                foreignKey: 'id_pelajar',
                as: 'pelajar',
            });
        }
    }
    HistoryMateri.init(
        {
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
            id_materi: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'materi',
                    key: 'id_materi',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            waktu_akses: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },
        },
        {
            sequelize,
            modelName: 'HistoryMateri',
            tableName: 'historyMateri',
            timestamps: true,
        }
    );
    return HistoryMateri;
};