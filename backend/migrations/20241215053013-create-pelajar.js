'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('pelajar', {
      id_pelajar: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      id_user: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users', // Nama tabel users
          key: 'id_user',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      nama: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      nim: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
      },
      alamat: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      jenis_kelamin: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('pelajar');
  },
};
