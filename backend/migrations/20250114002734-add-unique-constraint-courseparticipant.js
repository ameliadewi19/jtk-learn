'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
      await queryInterface.addConstraint('courseParticipant', {
          fields: ['id_course', 'id_pelajar'],
          type: 'unique',
          name: 'unique_course_pelajar', // Nama constraint
      });
  },

  down: async (queryInterface, Sequelize) => {
      // Hapus constraint jika rollback
      await queryInterface.removeConstraint('courseParticipant', 'unique_course_pelajar');
  },
};
