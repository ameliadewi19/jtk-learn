const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/connection'); // Pastikan path sudah sesuai

// Import semua model
const User = require('./user')(sequelize, DataTypes);
const Course = require('./course')(sequelize, DataTypes);
const Pengajar = require('./pengajar')(sequelize, DataTypes);
const Pelajar = require('./pelajar')(sequelize, DataTypes);
const Materi = require('./materi')(sequelize, DataTypes);
const Jawaban = require('./jawaban')(sequelize, DataTypes);
const Pertanyaan = require('./pertanyaan')(sequelize, DataTypes);
const Quiz = require('./quiz')(sequelize, DataTypes);
const CourseParticipant = require('./courseParticipant')(sequelize, DataTypes);

// Pastikan asosiasi dijalankan dengan benar
const models = { User, Course, Pengajar, Pelajar, Materi, Jawaban, Pertanyaan, Quiz, CourseParticipant};

// Panggil method `associate` pada setiap model jika ada
Object.keys(models).forEach((modelName) => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

// Ekspor semua model dan koneksi Sequelize
module.exports = {
  sequelize,
  Sequelize,
  ...models, // Ekspor semua model sebagai properti
};
