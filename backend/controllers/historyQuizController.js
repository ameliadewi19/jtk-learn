const { sequelize, HistoryQuiz, Quiz, Course } = require('../models'); 

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


module.exports = {
    getAllHistoryQuiz
};