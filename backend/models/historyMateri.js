'use strict';

const { down } = require("../migrations/20241215053742-create-course");

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('historyMateri', {
            id_pelajar: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'pelajar', // Nama tabel pelajar
                    key: 'id_pelajar',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            id_materi: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'materi', // Nama tabel materi
                    key: 'id_materi',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            waktu_akses: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW,
            }
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('historyMateri');
    },
};