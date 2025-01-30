const { sequelize, HistoryQuiz, Quiz, Course } = require('../models');
const { Op, col, fn, literal } = require('sequelize');

const getAllHistoryQuiz = async (req, res) => {
    try {
        const { id_pelajar } = req.params;

        const historyQuizData = await HistoryQuiz.findAll({
            where: {
                id_pelajar: parseInt(id_pelajar),
                id_history_quiz: {
                    [Op.eq]: literal(`
                        (SELECT id_history_quiz FROM "historyQuiz" AS sub_hq
                         WHERE sub_hq.id_quiz = "HistoryQuiz".id_quiz
                         ORDER BY sub_hq.nilai DESC, sub_hq.waktu_selesai DESC
                         LIMIT 1)
                    `),
                },
            },
            attributes: [
                'id_history_quiz',
                'id_pelajar',
                'id_quiz',
                'waktu_mulai',
                'waktu_selesai',
                'nilai',
            ],
            include: [
                {
                    model: Quiz,
                    as: 'quiz',
                    attributes: ['nama_quiz', 'deskripsi_quiz'],
                    include: {
                        model: Course,
                        as: 'course',
                        attributes: ['nama_course'],
                    },
                },
            ],
            order: [['id_quiz', 'ASC']],
        });

        const result = historyQuizData.map((history) => ({
            id_history_quiz: history.id_history_quiz,
            id_pelajar: history.id_pelajar,
            nama_course: history.quiz.course.nama_course,
            nama_quiz: history.quiz.nama_quiz,
            deskripsi_quiz: history.quiz.deskripsi_quiz,
            waktu_mulai: history.waktu_mulai,
            waktu_selesai: history.waktu_selesai,
            nilai: history.nilai,
        }));

        res.status(200).json(result);
    } catch (error) {
        console.error('Error fetching history quiz:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = {
    getAllHistoryQuiz,
};
