'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('pertanyaan', {
      id_pertanyaan: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      id_quiz: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'quiz', // Nama tabel quiz
          key: 'id_quiz',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      nama_pertanyaan: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      konten_pertanyaan: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      jenis_pertanyaan: {
        type: Sequelize.ENUM('pilihan_ganda', 'jawaban_singkat', 'operasi_matematika'),
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

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('pertanyaan');
  }
};
