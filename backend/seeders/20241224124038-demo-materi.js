'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
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

    await queryInterface.bulkInsert('materi', [
      {
        id_course: idCourse,
        nama_materi: 'Pengenalan Pemrograman Web',
        konten_materi: 'Pengenalan_Pemrograman.pdf',
        jenis_materi: 'teks',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_course: idCourse,
        nama_materi: 'HTML',
        konten_materi: 'HTML.mp4',
        jenis_materi: 'video',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_course: idCourse,
        nama_materi: 'CSS',
        konten_materi: 'CSS.pdf',
        jenis_materi: 'teks',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('materi', null, {});
  }
};
