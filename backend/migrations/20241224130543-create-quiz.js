'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('quiz', {
      id_quiz: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      id_course: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'course', // Nama tabel course
          key: 'id_course',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      nama_quiz: {
        type: Sequelize.STRING,
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
    await queryInterface.dropTable('quiz');
  }
};
