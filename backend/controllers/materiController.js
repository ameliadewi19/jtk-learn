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
      const oldFilePath = path.join(__dirname, '../../frontend/public/uploads/materials', `${materi.konten_materi}`);
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

    // Construct the file path
    const filePath = path.join(__dirname, '../../frontend/public/uploads/materials', `${materi.konten_materi}`);

    // Check if the file exists and delete it
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await materi.destroy();

    res.status(200).json({ message: 'Materi deleted successfully.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const upsertHistoryMateri = async (req, res) => {
  try {
      const { id_pelajar, id_materi } = req.params;
      const { waktu_akses } = req.body;

      // Debug log untuk payload
      console.log("Received payload:", req.body);

      // Cek apakah history materi sudah ada
      let historyMateri = await HistoryMateri.findOne({
          where: { id_pelajar, id_materi },
      });

      if (historyMateri) {
          // Jika sudah ada, update waktu_akses
          await historyMateri.update({ waktu_akses });

          return res.status(200).json({
              message: "HistoryMateri updated successfully."
          });
      } else {
          // Jika belum ada, buat data baru
          historyMateri = await HistoryMateri.create({
              id_pelajar,
              id_materi,
              waktu_akses,
          });

          return res.status(201).json({
              message: "HistoryMateri created successfully."
          });
      }
  } catch (error) {
      console.error("Error in upsertHistoryMateri:", error);
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
    upsertHistoryMateri
};
