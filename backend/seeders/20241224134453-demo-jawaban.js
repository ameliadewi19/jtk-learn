'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    // Ambil data dari tabel pertanyaan untuk mendapatkan id_pertanyaan
    const pertanyaan = await queryInterface.sequelize.query(
      'SELECT id_pertanyaan FROM pertanyaan LIMIT 3;',
      { type: Sequelize.QueryTypes.SELECT }
    );

    // Gunakan tiga id_pertanyaan sebagai id_pertanyaan untuk seeding data
    const idPertanyaan = pertanyaan.map((item) => item.id_pertanyaan);

    if (idPertanyaan === 0) {
      throw new Error('Tidak ada data pertanyaan. Pastikan tabel pertanyaan memiliki data.');
    }

    await queryInterface.bulkInsert('jawaban', [
      {
        id_pertanyaan: idPertanyaan[0],
        nama_jawaban: 'Hypertext Markup Language',
        konten_jawaban: 'HTML adalah singkatan dari Hyper Text Markup Language.',
        status_jawaban: 'benar',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_pertanyaan: idPertanyaan[0],
        nama_jawaban: 'Cascading Style Sheet',
        konten_jawaban: 'CSS adalah singkatan dari Cascading Style Sheet.',
        status_jawaban: 'salah',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_pertanyaan: idPertanyaan[0],
        nama_jawaban: 'JavaScript',
        konten_jawaban: 'JavaScript adalah bahasa pemrograman tingkat tinggi dan dinamis.',
        status_jawaban: 'salah',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_pertanyaan: idPertanyaan[1],
        nama_jawaban: 'jawaban1',
        konten_jawaban: 'Cascading style sheet',
        status_jawaban: 'benar',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_pertanyaan: idPertanyaan[1],
        nama_jawaban: 'jawaban2',
        konten_jawaban: 'cascading style sheet',
        status_jawaban: 'benar',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_pertanyaan: idPertanyaan[2],
        nama_jawaban: 'jawaban1',
        konten_jawaban: '5',
        status_jawaban: 'benar',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('jawaban', null, {});
  }
};
