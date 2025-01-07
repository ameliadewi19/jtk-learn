const express = require('express');
const {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  getCoursePengajar,
} = require('../controllers/courseController');
const router = express.Router();
const upload = require('../middleware/upload');

// Routes for Course
router.get('/', getAllCourses); // Get all courses
router.get('/:id', getCourseById); // Get course by ID
router.post('/', upload.single('gambar_course'), createCourse); // Create a new course
router.put('/:id', upload.single('gambar_course'), updateCourse); // Update course by ID
router.get('/pengajar/:id', getCoursePengajar); // Get course by pengajar ID

module.exports = router;
