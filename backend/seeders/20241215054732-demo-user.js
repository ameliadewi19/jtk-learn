'use strict';

const bcrypt = require('bcrypt'); // Import bcrypt

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const saltRounds = 10; // Jumlah ronde hashing

    // Hash password sebelum insert
    const hashedPasswords = await Promise.all([
      bcrypt.hash('pelajar1', saltRounds),
      bcrypt.hash('pelajar2', saltRounds),
      bcrypt.hash('pengajar1', saltRounds),
      bcrypt.hash('pengajar2', saltRounds),
    ]);

    await queryInterface.bulkInsert(
      'users',
      [
        {
          email: 'pelajar1@example.com',
          password: hashedPasswords[0], // Password hashed
          role: 'pelajar',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          email: 'pelajar2@example.com',
          password: hashedPasswords[1], // Password hashed
          role: 'pelajar',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          email: 'pengajar1@example.com',
          password: hashedPasswords[2], // Password hashed
          role: 'pengajar',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          email: 'pengajar2@example.com',
          password: hashedPasswords[3], // Password hashed
          role: 'pengajar',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', null, {});
  },
};
