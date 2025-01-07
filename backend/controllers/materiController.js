const { Materi, Course } = require('../models');

// Get all materi
const getAllMateri = async (req, res) => {
  try {
    const materi = await Materi.findAll({
        include: [
          {
            model: Course,
            as: 'course', // Pastikan sama dengan alias di relasi
          },
        ],
      });;
    res.status(200).json(materi);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get materi by ID
const getMateriById = async (req, res) => {
  try {
    const { id } = req.params;
    const materi = await Materi.findOne({ 
        where: { id_materi: id },
        include: [{ model: Course, as: 'course' }],
    });
    if (!materi) {
      return res.status(404).json({ message: 'Materi not found.' });
    }

    res.status(200).json(materi);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create new materi
const createMateri = async (req, res) => {
  try {
    const { id_course, nama_materi, konten_materi, jenis_materi } = req.body;

    const materi = await Materi.create({
      id_course,
      nama_materi,
      konten_materi,
      jenis_materi,
    });

    res.status(201).json({ message: 'Materi created successfully.', materi });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update materi
const updateMateri = async (req, res) => {
  try {
    const { id } = req.params;
    const { nama_materi, konten_materi, jenis_materi } = req.body;

    const materi = await Materi.findOne({ where: { id_materi: id } });

    if (!materi) {
      return res.status(404).json({ message: 'Materi not found.' });
    }

    await materi.update({ nama_materi, konten_materi, jenis_materi });

    res.status(200).json({ message: 'Materi updated successfully.', materi });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete materi
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

module.exports = { 
    getAllMateri, 
    getMateriById, 
    createMateri, 
    updateMateri, 
    deleteMateri 
};
