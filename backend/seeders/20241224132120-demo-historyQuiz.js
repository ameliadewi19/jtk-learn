'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    // Ambil data dari tabel pelajar dan quiz untuk mendapatkan id_pelajar dan id_quiz
    const pelajar = await queryInterface.sequelize.query(
      'SELECT id_pelajar FROM pelajar LIMIT 1;',
      { type: Sequelize.QueryTypes.SELECT }
    );
    const quiz = await queryInterface.sequelize.query(
      'SELECT id_quiz FROM quiz LIMIT 1;',
      { type: Sequelize.QueryTypes.SELECT }
    );

    // Gunakan salah satu id_pelajar dan id_quiz untuk seeding data
    const idPelajar = pelajar[0]?.id_pelajar || null;
    const idQuiz = quiz[0]?.id_quiz || null;

    if (!idPelajar || !idQuiz) {
      throw new Error('Tidak ada data pelajar atau quiz. Pastikan tabel pelajar dan quiz memiliki data.');
    }

    await queryInterface.bulkInsert('historyQuiz', [
      {
        id_pelajar: idPelajar,
        id_quiz: idQuiz,
        waktu_mulai: new Date(),
        waktu_selesai: new Date(),
        nilai: 100,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('historyQuiz', null, {}); 
  }
};
