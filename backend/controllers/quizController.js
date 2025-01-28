const { Quiz, Course, Pertanyaan, Jawaban, HistoryQuiz, Pelajar } = require('../models');

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

// Get Pertanyaan by Quiz ID
const getPertanyaanByQuizId = async (req, res) => {
  try {
    const { id } = req.params;

    const pertanyaan = await Pertanyaan.findAll({
      where: { id_quiz:id },
      include: [
        {
          model: Quiz,
          as: 'quiz',
        },
      ],
    });

    if (!pertanyaan || pertanyaan.length === 0) {
      return res.status(404).json({ message: 'No questions found for the specified quiz ID.' });
    }

    res.status(200).json(pertanyaan);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Jawaban by Pertanyaan ID 
const getJawabanByPertanyaanId = async (req, res) => {
  try {
    const { id } = req.params;

    const jawaban = await Jawaban.findAll({
      where: { id_pertanyaan: id },
      include: [
        {
          model: Pertanyaan,
          as: 'pertanyaan',
        },
      ],
    });

    if (!jawaban || jawaban.length === 0) {
      return res.status(404).json({ message: 'No answers found for the specified question ID.' });
    }

    res.status(200).json(jawaban);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get history quiz by ID
const getHistoryQuizByID = async (req, res) => {
  try {
    const { id_pelajar, id_quiz } = req.params;
    const history = await HistoryQuiz.findAll({
      where: {id_pelajar, id_quiz},
      include: [
        {
          model: Quiz,
          as: 'quiz',
        },
        {
          model: Pelajar,
          as: 'pelajar'
        }
      ],
    });

    if (!history || history.length === 0) {
      return res.status(404).json({ message: 'No answers found for the specified question ID.' });
    }

    res.status(200).json(history);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const upsertHistoryQuiz = async (req, res) => {
  try {
    const { id_pelajar, id_quiz } = req.params;
    const { waktu_mulai, waktu_selesai, nilai } = req.body;

    // Debug log untuk payload
    console.log("Received payload:", req.body);
    
    let historyQuiz = await HistoryQuiz.findOne({
      where: { id_pelajar, id_quiz },
    });

    if (historyQuiz) {
      // Jika sudah ada, lakukan update
      await historyQuiz.update({ waktu_mulai, waktu_selesai, nilai });

      return res.status(200).json({
        message: "HistoryQuiz updated successfully.",
        data: historyQuiz,
      });
    } else {
      // Jika tidak ada, buat resource baru
      historyQuiz = await HistoryQuiz.create({
        id_quiz,
        id_pelajar,
        waktu_mulai,
        waktu_selesai,
        nilai,
      });

      return res.status(201).json({
        message: "HistoryQuiz created successfully.",
        data: historyQuiz,
      });
    }
  } catch (error) {
    console.error("Error in upsertHistoryQuiz:", error);
    res.status(500).json({ error: error.message });
  }
};


module.exports = { 
    getAllQuiz, 
    getQuizById, 
    createQuiz, 
    updateQuiz, 
    deleteQuiz,
    getPertanyaanByQuizId,
    getJawabanByPertanyaanId,
    getHistoryQuizByID,
    upsertHistoryQuiz 
};
