'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('course', {
      id_course: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      id_pengajar: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'pengajar', // Nama tabel pengajar
          key: 'kode_dosen',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      nama_course: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      enrollment_key: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      gambar_course: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      deskripsi: {
        type: Sequelize.TEXT,
        allowNull: true,
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
    await queryInterface.dropTable('course');
  },
};
