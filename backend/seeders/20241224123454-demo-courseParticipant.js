'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    // Ambil daya dari tabel course dan pelajar untuk mendapatkan id_course dan id_pelajar
    const course = await queryInterface.sequelize.query(
      'SELECT id_course FROM course LIMIT 1;',
      { type: Sequelize.QueryTypes.SELECT }
    );
    const pelajar = await queryInterface.sequelize.query(
      'SELECT id_pelajar FROM pelajar LIMIT 1;',
      { type: Sequelize.QueryTypes.SELECT }
    );

    // Gunakan salah satu id_course dan id_pelajar untuk seeding data
    const idCourse = course[0]?.id_course || null;
    const idPelajar = pelajar[0]?.id_pelajar || null;

    if (!idCourse || !idPelajar) {
      throw new Error('Tidak ada data course atau pelajar. Pastikan tabel course dan pelajar memiliki data.');
    }

    await queryInterface.bulkInsert('courseParticipant', [
      {
        id_course: idCourse,
        id_pelajar: idPelajar,
        persentase_course: 0,
        status_penyelesaian: 'In Progress',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('courseParticipant');
  },
};