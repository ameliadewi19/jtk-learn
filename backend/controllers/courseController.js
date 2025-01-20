const { Course, Pengajar } = require('../models'); // Import model
const upload = require('../middleware/upload')
const fs = require('fs');
const path = require('path');
const { Op } = require('sequelize');

// Get all courses
const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.findAll({
      include: [
        {
          model: Pengajar,
          as: 'pengajar', // Pastikan sama dengan alias di relasi
        },
      ],
    });
    res.status(200).json(courses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// Get course by ID
const getCourseById = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await Course.findOne({
      where: { id_course: id },
      include: [
        {
          model: Pengajar,
          as: 'pengajar',
          attributes: ['nama'], 
        },
      ],
    });

    if (!course) {
      return res.status(404).json({ message: 'Course not found.' });
    }

    res.status(200).json(course);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch the course.' });
  }
};


const createCourse = async (req, res) => {
  try {
    const { id_pengajar, nama_course, enrollment_key, deskripsi } = req.body;

    if (!req.file) {
      return res.status(402).json({ message: 'Harap unggah gambar course.' });
    }

    const gambar_course = req.file.filename;

    const existingCourse = await Course.findOne({ where: { nama_course } });
    if (existingCourse) {
      return res.status(401).json({ message: 'Nama course sudah terdaftar, silakan gunakan nama lain.' });
    } else {
      const course = await Course.create({
        id_pengajar,
        nama_course,
        enrollment_key,
        gambar_course,
        deskripsi,
      });

      res.status(201).json({ message: 'Course created successfully.', course });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create course.' });
  }
};


const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { id_pengajar, nama_course, enrollment_key, deskripsi } = req.body;

    const gambar_course = req.file ? req.file.filename : null;

    const course = await Course.findOne({ where: { id_course: id } });

    if (!course) {
      return res.status(404).json({ message: 'Course not found.' });
    }

    const existingCourse = await Course.findOne({
      where: { nama_course, id_course: { [Op.ne]: id } },  // Memastikan ID berbeda dari course yang sedang diupdate
    });

    if (existingCourse) {
      return res.status(400).json({ message: 'Nama course sudah terdaftar, silakan gunakan nama lain.' });
    } else {
      // Jika gambar_course null, gunakan gambar_course yang lama dari database
      const finalGambarCourse = gambar_course || course.gambar_course;

      await course.update({
        id_pengajar,
        nama_course,
        enrollment_key,
        gambar_course: finalGambarCourse,
        deskripsi,
      });

      res.status(200).json({ message: 'Course updated successfully.', course });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update the course.' });
  }
};


//get course sesuai id pengajar
const getCoursePengajar = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await Course.findAll({
      where: { id_pengajar: id },
      include: [{ model: Pengajar, as: 'pengajar' }],
    });

    res.status(200).json(course);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch the course.' });
  }
};

module.exports = {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  getCoursePengajar,
};
