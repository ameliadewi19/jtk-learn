const { Quiz, Pertanyaan, Jawaban, Course, sequelize } = require('../models');
const { getAllPertanyaan, createPertanyaan, updatePertanyaan } = require('./pertanyaanController');
const { getJawabanByIdPertanyaan, createJawaban, updateJawaban } = require('./jawabanController');
const { Quiz, Course, Pertanyaan, Jawaban, HistoryQuiz, Pelajar } = require('../models');

// get all quiz
const getAllQuiz = async (req, res) => {
    try {
        const quiz = await Quiz.findAll();
        res.status(200).json(quiz);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

// get quiz by course id
const getQuizByCourseId = async (req, res) => {
    try {
        const { id } = req.params;
        const quiz = await Quiz.findAll({ where: { id_course: id } });
        res.status(200).json(quiz);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

// get quiz (id_quiz, name) and course (name) by pengajar id
const getQuizByPengajarId = async (req, res) => {
    try {
        const { id } = req.params;
        const quizzes = await Quiz.findAll({
            include: {
                model: Course,
                as: 'course',
                where: { id_pengajar: id },
                attributes: ['nama_course'],
            },
            attributes: ['id_quiz', 'nama_quiz'],
        });

        // Transform the data into the desired structure
        const transformedData = quizzes.map(quiz => ({
            id_quiz: quiz.id_quiz,
            nama_quiz: quiz.nama_quiz,
            nama_course: quiz.course.nama_course,
        }));

        res.status(200).json(transformedData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

// get quiz data by id
const getQuizById = async (req, res) => {
    try {
        const { id } = req.params;
        const quiz = await Quiz.findByPk(id);

        if (!quiz) {
            return res.status(404).json({ error: 'Quiz not found' });
        }

        // Fetch all pertanyaan for the quiz
        const pertanyaan = await getAllPertanyaan(id);

        // Fetch all jawaban for each pertanyaan
        const jawabanPromises = pertanyaan.map(async (pertanyaanItem) => {
            const jawaban = await getJawabanByIdPertanyaan(pertanyaanItem.id_pertanyaan);
            return jawaban;
        });

        const jawaban = await Promise.all(jawabanPromises);

        const formattedQuiz = {
            id_quiz: quiz.id_quiz,
            id_course: quiz.id_course,
            nama_quiz: quiz.nama_quiz,
            deskripsi_quiz: quiz.deskripsi_quiz,
            durasi: quiz.durasi,
            pertanyaan: pertanyaan.map((pertanyaanItem) => ({
                nama_pertanyaan: pertanyaanItem.nama_pertanyaan,
                konten_pertanyaan: pertanyaanItem.konten_pertanyaan,
                jenis_pertanyaan: pertanyaanItem.jenis_pertanyaan,
                order: pertanyaanItem.order,
            })),
            jawaban: jawaban.map((jawabanList) =>
                jawabanList.map((jawabanItem) => ({
                    nama_jawaban: jawabanItem.nama_jawaban,
                    konten_jawaban: jawabanItem.konten_jawaban,
                    status_jawaban: jawabanItem.status_jawaban,
                }))
            ),
        };

        res.status(200).json(formattedQuiz);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

// create new quiz with questions and answers
const createQuiz = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const { id_course, nama_quiz, deskripsi_quiz, durasi, pertanyaan, jawaban } = req.body;

        const quiz = await Quiz.create({
            id_course,
            nama_quiz,
            deskripsi_quiz,
            durasi,
        }, { transaction });

        await Promise.all(pertanyaan.map(async (q, i) => {
            const question = await createPertanyaan(quiz.id_quiz, q.nama_pertanyaan, q.konten_pertanyaan, q.jenis_pertanyaan, transaction);
            await Promise.all(jawaban[i].map(async (a) => {
                await createJawaban(question.id_pertanyaan, a.nama_jawaban, a.konten_jawaban, a.status_jawaban, transaction);
            }));
        }));

        await transaction.commit();
        res.status(201).json(quiz);
    } catch (error) {
        await transaction.rollback();
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

// update quiz, pertanyaan, and jawaban
const updateQuiz = async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
        const { id } = req.params;
        const { id_course, nama_quiz, deskripsi_quiz, durasi, pertanyaan, jawaban } = req.body;

        const quiz = await Quiz.findByPk(id, { transaction });
        if (!quiz) {
            return res.status(404).json({ error: 'Quiz not found' });
        }

        await quiz.update({
            id_course,
            nama_quiz,
            deskripsi_quiz,
            durasi,
        }, { transaction });

        const existingQuestions = await Pertanyaan.findAll({ where: { id_quiz: id }, transaction });
        const questionTypes = ['pilihan_ganda', 'jawaban_singkat', 'operasi_matematika'];

        await Promise.all(questionTypes.map(async (type, i) => {
            const questionData = pertanyaan.find(q => q.jenis_pertanyaan === type);
            if (!questionData) {
                throw new Error(`Missing question of type ${type}`);
            }

            let question = existingQuestions.find(q => q.jenis_pertanyaan === type);
            if (question) {
                await updatePertanyaan(question.id_pertanyaan, questionData.nama_pertanyaan, questionData.konten_pertanyaan, type, transaction);
            } else {
                question = await createPertanyaan(id, questionData.nama_pertanyaan, questionData.konten_pertanyaan, type, transaction);
            }

            const existingAnswers = await Jawaban.findAll({ where: { id_pertanyaan: question.id_pertanyaan }, transaction });

            await Promise.all(jawaban[i].map(async (a, j) => {
                let answer = existingAnswers[j];
                if (answer) {
                    await updateJawaban(answer.id_jawaban, a.nama_jawaban, a.konten_jawaban, a.status_jawaban, transaction);
                } else {
                    await createJawaban(question.id_pertanyaan, a.nama_jawaban, a.konten_jawaban, a.status_jawaban, transaction);
                }
            }));
        }));

        await transaction.commit();
        res.status(200).json({ message: `Quiz with id ${id} has been updated` });
    } catch (error) {
        await transaction.rollback();
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

// delete quiz
const deleteQuiz = async (req, res) => {
    try {
        const { id } = req.params;
        await Quiz.destroy({ where: { id_quiz: id } });
        res.status(200).json({ message: `Quiz with id ${id} has been deleted` });
    } catch (error) {
        console.error(error);
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
    getQuizByCourseId,
    getQuizByPengajarId,
    getQuizById,
    createQuiz,
    updateQuiz,
    deleteQuiz
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