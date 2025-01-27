const { DetailHistoryQuiz, HistoryQuiz, Pelajar } = require('../models');

const getDetailHistoryQuizData = async (req) => {
    try {
        const { id_quiz } = req.params;
        const detailHistoryQuizData = await DetailHistoryQuiz.findAll({
            include: [
                {
                    model: HistoryQuiz,
                    as: 'history_quiz',
                    where: { id_quiz }, // Find based on id_quiz
                    include: [
                        {
                            model: Pelajar,
                            as: 'pelajar',
                            attributes: ['nama'], // Get the student name
                        },
                    ],
                    attributes: ['nilai'], // Get the total grades
                },
            ],
            attributes: ['id_detail_history_quiz', 'status'], // Get the status
        });

        return detailHistoryQuizData;
    } catch (error) {
        console.error('Error fetching detail history quiz data:', error);
    }
}

module.exports = {
    getDetailHistoryQuizData,
};