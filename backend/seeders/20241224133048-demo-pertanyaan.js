'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    // Ambil data dari tabel quiz untuk mendapatkan id_quiz
    const quiz = await queryInterface.sequelize.query(
      'SELECT id_quiz FROM quiz LIMIT 1;',
      { type: Sequelize.QueryTypes.SELECT }
    );

    // Gunakan salah satu id_quiz sebagai id_quiz untuk seeding data
    const idQuiz = quiz[0]?.id_quiz || null;

    if (!idQuiz) {
      throw new Error('Tidak ada data quiz. Pastikan tabel quiz memiliki data.');
    }

    await queryInterface.bulkInsert('pertanyaan', [
      {
        id_quiz: idQuiz,
        nama_pertanyaan: 'Pemrograman Web',
        konten_pertanyaan: 'Apa itu HTML?',
        jenis_pertanyaan: 'pilihan_ganda',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_quiz: idQuiz,
        nama_pertanyaan: 'CSS',
        konten_pertanyaan: 'Apa kepanjangan dari CSS?',
        jenis_pertanyaan: 'jawaban_singkat',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_quiz: idQuiz,
        nama_pertanyaan: 'Operasi Matematika',
        konten_pertanyaan: 'Berapakah hasil dari 2 + 3?',
        jenis_pertanyaan: 'operasi_matematika',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('pertanyaan', null, {});
  }
};
