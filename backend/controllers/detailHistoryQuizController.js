const { DetailHistoryQuiz, HistoryQuiz, Pelajar, Pertanyaan } = require('../models');

const getDetailHistoryQuizData = async (req, res) => {
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
                {
                    model: Pertanyaan,
                    as: 'pertanyaan',
                    attributes: ['jenis_pertanyaan'], // Get the question type
                },
            ],
            attributes: ['status'], // Get the status
        });

        // Transform the data into the desired structure
        const transformedData = detailHistoryQuizData.reduce((acc, item) => {
            const studentName = item.history_quiz.pelajar.nama;
            const nilai = item.history_quiz.nilai;
            const jenisPertanyaan = item.pertanyaan.jenis_pertanyaan;
            const status = item.status;

            let student = acc.find(s => s.student_name === studentName);
            if (!student) {
                student = {
                    student_name: studentName,
                    nilai: nilai,
                    detail: []
                };
                acc.push(student);
            }

            student.detail.push({
                jenis_pertanyaan: jenisPertanyaan,
                status: status
            });

            return acc;
        }, []);

        res.json(transformedData);
    } catch (error) {
        console.error('Error fetching detail history quiz data:', error);
        res.status(500).json({ error: 'Failed to fetch detail history quiz data' });
    }
}

module.exports = {
    getDetailHistoryQuizData,
};