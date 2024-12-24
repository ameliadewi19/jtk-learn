'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    // Ambil data dari tabel pelajar dan materi untuk mendapatkan id_pelajar dan id_materi
    const pelajar = await queryInterface.sequelize.query(
      'SELECT id_pelajar FROM pelajar LIMIT 1;',
      { type: Sequelize.QueryTypes.SELECT }
    );
    const materi = await queryInterface.sequelize.query(
      'SELECT id_materi FROM materi LIMIT 1;',
      { type: Sequelize.QueryTypes.SELECT }
    );

    // Gunakan salah satu id_pelajar dan id_materi untuk seeding data
    const idPelajar = pelajar[0]?.id_pelajar || null;
    const idMateri = materi[0]?.id_materi || null;

    if (!idPelajar || !idMateri) {
      throw new Error('Tidak ada data pelajar atau materi. Pastikan tabel pelajar dan materi memiliki data.');
    }

    await queryInterface.bulkInsert('historyMateri', [
      {
        id_pelajar: idPelajar,
        id_materi: idMateri,
        waktu_akses: new Date(),
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('historyMateri', null, {});
  }
};
