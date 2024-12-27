'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Ambil data dari tabel course untuk mendapatkan id_course
    const course = await queryInterface.sequelize.query(
      'SELECT id_course FROM course LIMIT 1;',
      { type: Sequelize.QueryTypes.SELECT }
    );

    // Gunakan salah satu id_course sebagai id_course untuk seeding data
    const idCourse = course[0]?.id_course || null;

    if (!idCourse) {
      throw new Error('Tidak ada data course. Pastikan tabel course memiliki data.');
    }

    await queryInterface.bulkInsert('quiz', [
      {
        id_course: idCourse,
        nama_quiz: 'Pemrograman Web',
        deskripsi_quiz: 'Quiz tentang pemrograman web',
        durasi: 40,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_course: idCourse,
        nama_quiz: 'HTML',
        deskripsi_quiz: 'Quiz tentang HTML',
        durasi: 30,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('quiz', null, {});
  }
};