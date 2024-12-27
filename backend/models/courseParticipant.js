'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class CourseParticipant extends Model {
        static associate(models) {
            // Relasi dengan tabel pelajar
            CourseParticipant.belongsTo(models.Pelajar, {
                foreignKey: 'id_pelajar',
                as: 'pelajar', // Pastikan alias ini sesuai dengan apa yang dipakai di query
            });
            // Relasi dengan tabel course
            CourseParticipant.belongsTo(models.Course, {
                foreignKey: 'id_course',
                as: 'course', // Pastikan alias ini sesuai dengan apa yang dipakai di query
            });
        }
    }
    CourseParticipant.init(
        {
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
            persentase_course: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            status_penyelesaian: {
                type: DataTypes.ENUM('In Progress', 'Completed'),
                allowNull: false,
                defaultValue: 'In Progress',
            },
        },
        {
            sequelize,
            modelName: 'CourseParticipant',
            tableName: 'courseParticipant',
            timestamps: true, // Untuk createdAt dan updatedAt
        }
    );
    return CourseParticipant;
};