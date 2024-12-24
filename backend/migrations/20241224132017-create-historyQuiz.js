'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('historyQuiz', {
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
      waktu_mulai: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      waktu_selesai: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      nilai: {
        type: Sequelize.INTEGER,
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
    await queryInterface.dropTable('historyQuiz');
  }
};
