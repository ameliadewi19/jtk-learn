const { Materi, Course, HistoryMateri } = require('../models');

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

module.exports = { 
    getAllMateri, 
    createMateri, 
    updateMateri, 
    deleteMateri,
    createHistoryMateri,
    updateHistoryMateri 
};
