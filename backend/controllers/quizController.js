const { Quiz, Course } = require('../models');

// Get all quiz
const getAllQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findAll({
        include: [
          {
            model: Course,
            as: 'course', // Pastikan sama dengan alias di relasi
          },
        ],
      });;
    res.status(200).json(quiz);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get quiz by ID
const getQuizById = async (req, res) => {
  try {
    const { id } = req.params;
    const quiz = await Quiz.findOne({ 
        where: { id_quiz: id },
        include: [{ model: Course, as: 'course' }],
    });
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found.' });
    }

    res.status(200).json(quiz);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create new quiz
const createQuiz = async (req, res) => {
  try {
    const { id_course, nama_quiz, deskripsi_quiz, durasi } = req.body;

    const quiz = await Quiz.create({
      id_course,
      nama_quiz,
      deskripsi_quiz,
      durasi,
    });

    res.status(201).json({ message: 'Quiz created successfully.', quiz });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update quiz
const updateQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    const { nama_quiz, deskripsi_quiz, durasi } = req.body;

    const quiz = await Quiz.findOne({ where: { id_quiz: id } });

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found.' });
    }

    await quiz.update({ nama_quiz, deskripsi_quiz, durasi });

    res.status(200).json({ message: 'Quiz updated successfully.', quiz });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete quiz
const deleteQuiz = async (req, res) => {
  try {
    const { id } = req.params;

    const quiz = await Quiz.findOne({ where: { id_quiz: id } });

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found.' });
    }

    await quiz.destroy();

    res.status(200).json({ message: 'Quiz deleted successfully.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { 
    getAllQuiz, 
    getQuizById, 
    createQuiz, 
    updateQuiz, 
    deleteQuiz 
};
