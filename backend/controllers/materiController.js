const { Materi, Course } = require('../models');

const getAllMateri = async (req, res) => {
  try {
    const { id } = req.params;
    const materi = await Materi.findAll({
      where: { id_course: id },
      include: [
        {
          model: Course,
          as: 'course',
        },
      ],
    });
    res.status(200).json(materi);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const createMateri = async (req, res) => {
  try {
    const { id_course, nama_materi, jenis_materi } = req.body;
    const konten_materi = req.file.filename; 

    const materi = await Materi.create({
      id_course,
      nama_materi,
      konten_materi,
      jenis_materi,
    });

    res.status(201).json({ message: 'Materi created successfully.', materi });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const updateMateri = async (req, res) => {
  try {
    const { nama_materi, jenis_materi, id_materi } = req.body;

    console.log(req.body);

    const materi = await Materi.findOne({ where: { id_materi: id_materi } });

    if (!materi) {
      return res.status(404).json({ message: 'Materi not found.' });
    }

    // Periksa apakah ada file baru yang diunggah
    const konten_materi = req.file ? req.file.filename : materi.konten_materi;

    // Update materi
    await materi.update({ nama_materi, jenis_materi, konten_materi });

    res.status(200).json({ message: 'Materi updated successfully.', materi });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};


const deleteMateri = async (req, res) => {
  try {
    const { id } = req.params;

    const materi = await Materi.findOne({ where: { id_materi: id } });

    if (!materi) {
      return res.status(404).json({ message: 'Materi not found.' });
    }

    await materi.destroy();

    res.status(200).json({ message: 'Materi deleted successfully.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//fetch one data material by id
const getMateriById = async (req, res) => {
  try {
    const { id } = req.params;
    const materi = await Materi.findOne({
      where: { id_materi: id },
      include: [
        {
          model: Course,
          as: 'course',
        },
      ],
    });
    res.status(200).json(materi);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllMateri,
  createMateri,
  updateMateri,
  deleteMateri,
  getMateriById,
};
