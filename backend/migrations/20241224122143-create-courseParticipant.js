'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('courseParticipant', {
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
      persentase_course: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      status_penyelesaian: {
        type: Sequelize.ENUM('In Progress', 'Completed'),
        allowNull: false,
        defaultValue: 'In Progress',
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
    await queryInterface.dropTable('courseParticipant');
  },
};

