const { Materi, Course, HistoryMateri } = require('../models');
const fs = require('fs');
const path = require('path');


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

    // Cari materi berdasarkan ID
    const materi = await Materi.findOne({ where: { id_materi: id_materi } });

    if (!materi) {
      return res.status(404).json({ message: 'Materi not found.' });
    }

    // Variabel untuk menyimpan nama file baru
    let konten_materi = materi.konten_materi;

    if (req.file) {
      // Hapus file lama jika ada
      const oldFilePath = path.join(__dirname, '../frontend/public/uploads/materials', materi.konten_materi);
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath); // Hapus file lama
      }

      // Ambil nama file baru yang diunggah
      konten_materi = req.file.filename;
    }

    // Update data materi di database
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

const createHistoryMateri = async (req, res) => {
  try {
      const { id_pelajar, id_materi, waktu_akses } = req.body;

      const newHistoryMateri = await HistoryMateri.create({
          id_pelajar,
          id_materi,
          waktu_akses,
      });

      res.status(201).json({
          message: 'HistoryMateri created successfully.',
          historyMateri: newHistoryMateri,
      });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};

const updateHistoryMateri = async (req, res) => {
  try {
      const { id_pelajar, id_materi } = req.params;
      const { waktu_akses } = req.body;

      // Cari data berdasarkan id_pelajar dan id_materi
      const historyMateri = await HistoryMateri.findOne({
          where: { id_pelajar, id_materi },
      });

      if (!historyMateri) {
          return res.status(404).json({ message: 'HistoryMateri not found.' });
      }

      // Update data langsung menggunakan instance model
      await historyMateri.update({ waktu_akses });

      res.status(200).json({
          message: 'HistoryMateri updated successfully.',
          historyMateri,
      });
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
    createHistoryMateri,
    updateHistoryMateri 
};
