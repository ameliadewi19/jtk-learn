const { sequelize, HistoryQuiz, Quiz, Course, Pelajar } = require('../models'); 

const getAllHistoryQuiz = async (req, res) => {
    try {
        const { id_pelajar } = req.params;

        const historyQuizData = await HistoryQuiz.findAll({
            where: { id_pelajar: parseInt(id_pelajar) },
            attributes: [
                'id_pelajar',
                'waktu_mulai',
                'waktu_selesai',
                [sequelize.fn('MAX', sequelize.col('nilai')), 'nilai'],
            ],
            include: [
                {
                    model: Quiz,
                    as: 'quiz',
                    attributes: ['id_quiz', 'nama_quiz', 'deskripsi_quiz', 'id_course'],
                    include: {
                        model: Course,
                        as: 'course',
                        attributes: ['id_course', 'nama_course'],
                    },
                },
            ],
            group: [
                'HistoryQuiz.id_pelajar',
                'HistoryQuiz.waktu_mulai',
                'HistoryQuiz.waktu_selesai',
                'HistoryQuiz.id_quiz',
                'quiz.id_quiz',
                'quiz.course.id_course',
            ],
        });
        
        
        res.status(200).json(historyQuizData.map((history) => ({
            nama_course: history.quiz.course.nama_course,
            nama_quiz: history.quiz.nama_quiz,
            deskripsi_quiz: history.quiz.deskripsi_quiz,
            waktu_mulai: history.waktu_mulai,
            waktu_selesai: history.waktu_selesai,
            nilai: history.dataValues.nilai,
        })));
    } catch (error) {
        console.error('Error fetching history quiz:', error);
        res.status(500).json({ error: 'Internal Server Error' });
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

// Get history quiz by score
const getHistoryQuizByScore = async (req, res) => {
  try {
    const { id_pelajar, id_quiz, nilai } = req.params;

    const history = await HistoryQuiz.findOne({
      where: { id_pelajar, id_quiz, nilai },
      include: [
        {
          model: Quiz,
          as: "quiz",
        },
        {
          model: Pelajar,
          as: "pelajar",
        },
      ],
    });

    if (!history || history.length === 0) {
      return res.status(404).json({
        message: "No history found for the specified criteria.",
      });
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
      
      let historyQuiz = await HistoryQuiz.findOne({
        where: { id_pelajar, id_quiz },
      });
  
      if (historyQuiz) {
        await historyQuiz.update({ waktu_mulai, waktu_selesai, nilai });
  
        return res.status(200).json({
          message: "HistoryQuiz updated successfully.",
          data: historyQuiz,
        });
      } else {
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
    getAllHistoryQuiz,
    getHistoryQuizByID,
    upsertHistoryQuiz,
    getHistoryQuizByScore
};