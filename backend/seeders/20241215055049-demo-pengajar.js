'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'pengajar',
      [
        {
          id_user: 3,
          nip: '1987654321',
          nama: 'Budi Pengajar',
          alamat: 'Jl. Pengajar 1',
          jenis_kelamin: 'L',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id_user: 4,
          nip: '2987654321',
          nama: 'Rina Pengajar',
          alamat: 'Jl. Pengajar 2',
          jenis_kelamin: 'P',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('pengajar', null, {});
  },
};
