'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Ambil data dari tabel pengajar untuk mendapatkan id_pengajar
    const pengajar = await queryInterface.sequelize.query(
      'SELECT kode_dosen FROM pengajar LIMIT 1;',
      { type: Sequelize.QueryTypes.SELECT }
    );

    // Gunakan salah satu kode_dosen sebagai id_pengajar untuk seeding data
    const idPengajar = pengajar[0]?.kode_dosen || null;

    if (!idPengajar) {
      throw new Error('Tidak ada data pengajar. Pastikan tabel pengajar memiliki data.');
    }

    await queryInterface.bulkInsert('course', [
      {
        nama_course: 'Pemrograman Web',
        enrollment_key: 'web12345',
        gambar_course: 'pemrograman_web.jpg',
        deskripsi: 'Belajar dasar-dasar pemrograman web.',
        id_pengajar: idPengajar,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        nama_course: 'Pemrograman Mobile',
        enrollment_key: 'mobile456',
        gambar_course: 'pemrograman_mobile.jpg',
        deskripsi: 'Belajar dasar-dasar pengembangan aplikasi mobile.',
        id_pengajar: idPengajar,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('course', null, {});
  },
};
