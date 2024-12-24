'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'pelajar',
      [
        {
          id_user: 1,
          nama: 'Andi Pelajar',
          nim: '12345678',
          alamat: 'Jl. Pelajar 1',
          jenis_kelamin: 'L',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id_user: 2,
          nama: 'Siti Pelajar',
          nim: '87654321',
          alamat: 'Jl. Pelajar 2',
          jenis_kelamin: 'P',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('pelajar', null, {});
  },
};
