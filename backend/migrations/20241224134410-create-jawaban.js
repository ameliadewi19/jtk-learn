'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('jawaban', {
      id_jawaban: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      id_pertanyaan: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'pertanyaan', // Nama tabel pertanyaan
          key: 'id_pertanyaan',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      nama_jawaban: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      konten_jawaban: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      status_jawaban: {
        type: Sequelize.ENUM('benar', 'salah'),
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('jawaban');
  }
};