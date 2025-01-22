'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // get 1 data from historyQuiz
    const historyQuiz = await queryInterface.sequelize.query(
      `SELECT * FROM "historyQuiz" LIMIT 1;`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    const idHistoryQuiz = historyQuiz[0]?.id_history_quiz || null;

    if (!idHistoryQuiz) {
      throw new Error('Tidak ada data historyQuiz. Pastikan tabel historyQuiz memiliki data.');
    }

    await queryInterface.bulkInsert('detailHistoryQuiz', [
      {
        id_history_quiz: idHistoryQuiz,
        id_pertanyaan: 1,
        id_jawaban: 1,
        jawaban_text: null,
        status: 'benar',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_history_quiz: idHistoryQuiz,
        id_pertanyaan: 2,
        id_jawaban: null,
        jawaban_text: 'Cascading style sheet',
        status: 'benar',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_history_quiz: idHistoryQuiz,
        id_pertanyaan: 3,
        id_jawaban: null,
        jawaban_text: '5',
        status: 'benar',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('detailHistoryQuiz', null, {});
  }
};
