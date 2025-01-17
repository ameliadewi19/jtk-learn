const { Quiz, Pertanyaan, Jawaban, sequelize } = require('../models');
const { createPertanyaan, updatePertanyaan } = require('./pertanyaanController');
const { createJawaban, updateJawaban } = require('./jawabanController');

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

module.exports = {
    getAllQuiz,
    createQuiz,
    updateQuiz,
    deleteQuiz
};
