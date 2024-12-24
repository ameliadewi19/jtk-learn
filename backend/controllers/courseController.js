const { Course, Pengajar } = require('../models'); // Import model
const upload = require('../middleware/upload')

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
      include: [{ model: Pengajar, as: 'pengajar' }],
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

// Create a new course with image upload
const createCourse = async (req, res) => {
    try {
      const { id_pengajar, nama_course, enrollment_key, deskripsi } = req.body;
      const gambar_course = req.file ? req.file.filename : null; // Mendapatkan nama file gambar yang di-upload
  
      if (!gambar_course) {
        return res.status(400).json({ message: 'Image is required' });
      }
  
      if (enrollment_key.length < 8 || enrollment_key.length > 12) {
        return res.status(400).json({ message: 'Enrollment key must be between 8 and 12 characters.' });
      }

      const course = await Course.create({
        id_pengajar,
        nama_course,
        enrollment_key,
        gambar_course, // Simpan nama file gambar di DB
        deskripsi,
      });
  
      res.status(201).json({ message: 'Course created successfully.', course });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to create the course.' });
    }
  };

// Update course
const updateCourse = async (req, res) => {
    try {
      const { id } = req.params;
      const { id_pengajar, nama_course, enrollment_key, deskripsi } = req.body;
      const gambar_course = req.file ? req.file.filename : null; // Mendapatkan nama file gambar yang di-upload, jika ada
  
      // Cari course berdasarkan ID
      const course = await Course.findOne({ where: { id_course: id } });
  
      if (!course) {
        return res.status(404).json({ message: 'Course not found.' });
      }

      if (enrollment_key.length < 8 || enrollment_key.length > 12) {
        return res.status(400).json({ message: 'Enrollment key must be between 8 and 12 characters.' });
      }
  
      // Jika ada gambar baru yang di-upload, perbarui nama file gambarnya
      if (gambar_course) {
        await course.update({
          id_pengajar,
          nama_course,
          enrollment_key,
          gambar_course,  // Perbarui gambar_course dengan nama file gambar baru
          deskripsi,
        });
      } else {
        // Jika tidak ada gambar baru, perbarui tanpa mengubah gambar
        await course.update({
          id_pengajar,
          nama_course,
          enrollment_key,
          deskripsi,
        });
      }
  
      res.status(200).json({ message: 'Course updated successfully.', course });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to update the course.' });
    }
  };  

// Delete course
const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await Course.findOne({ where: { id_course: id } });

    if (!course) {
      return res.status(404).json({ message: 'Course not found.' });
    }

    await course.destroy();

    res.status(200).json({ message: 'Course deleted successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to delete the course.' });
  }
};

module.exports = {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
};
