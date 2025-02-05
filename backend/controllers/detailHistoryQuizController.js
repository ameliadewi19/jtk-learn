const { DetailHistoryQuiz, HistoryQuiz, Pelajar, Pertanyaan, Jawaban } = require('../models');

const getAllDetailHistQuizByHistQuizID = async (req,res) => {
    try {
        const { id_history_quiz } = req.params;
        const historyQuizDetails = await DetailHistoryQuiz.findAll({
            where: { id_history_quiz },
            include: [
                {
                    model: HistoryQuiz,
                    as: 'history_quiz',
                    include: [
                        {
                            model: Pelajar,
                            as: 'pelajar',
                            attributes: ['nama'], // Ambil nama pelajar
                        },
                    ],
                    attributes: ['nilai'], // Ambil nilai quiz
                },
                {
                    model: Pertanyaan,
                    as: 'pertanyaan',
                },
                {
                    model: Jawaban,
                    as: 'jawaban',
                }
            ],
        });
        res.status(200).json(historyQuizDetails);
    } catch (error) {
        console.error('Error fetching history quiz details:', error);
        res.status(500).json({ error: 'Failed to fetch history quiz details' });
    }
};

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
                    attributes: ['id_history_quiz', 'nilai'], // Get the total grades
                },
                {
                    model: Pertanyaan,
                    as: 'pertanyaan',
                    attributes: ['jenis_pertanyaan'], // Get the question type
                },
            ],
            attributes: ['id_history_quiz', 'status'], // Get the status
        });

        // Transform the data into the desired structure
        const transformedData = detailHistoryQuizData.reduce((acc, item) => {
            const studentName = item.history_quiz.pelajar.nama;
            const idHistoryQuiz = item.id_history_quiz;
            const nilai = item.history_quiz.nilai;
            const jenisPertanyaan = item.pertanyaan.jenis_pertanyaan;
            const status = item.status;

            let student = acc.find(s => s.student_name === studentName);
            if (!student) {
                student = {
                    student_name: studentName,
                    nilai: nilai,
                    history_quiz: []
                };
                acc.push(student);
            }

            let history = student.history_quiz.find(h => h.id_history_quiz === idHistoryQuiz);
            if (!history) {
                history = {
                    id_history_quiz: idHistoryQuiz,
                    correct_count: 0, // Inisialisasi jumlah status 'benar'
                    detail: []
                };
                student.history_quiz.push(history);
            }

            history.detail.push({
                jenis_pertanyaan: jenisPertanyaan,
                status: status
            });

            if (status === "benar") {
                history.correct_count += 1;
            }

            return acc;
        }, []);

        res.json(transformedData);
    } catch (error) {
        console.error('Error fetching detail history quiz data:', error);
        res.status(500).json({ error: 'Failed to fetch detail history quiz data' });
    }
}

const upsertDetailHistoryQuiz = async (req, res) => {
    try {
        const { id_history_quiz, id_pertanyaan, id_jawaban, jawaban_text, status } = req.body;

        if (!id_history_quiz || !id_pertanyaan) {
            return res.status(400).json({ error: 'id_history_quiz dan id_pertanyaan wajib diisi' });
        }

        const [detailHistoryQuiz, created] = await DetailHistoryQuiz.findOrCreate({
            where: { id_history_quiz, id_pertanyaan },
            defaults: { id_jawaban, jawaban_text, status },
        });

        if (!created) {
            // Jika sudah ada, update datanya
            await detailHistoryQuiz.update({ id_jawaban, jawaban_text, status });
        }

        res.json({
            message: created ? 'DetailHistoryQuiz created successfully' : 'DetailHistoryQuiz updated successfully',
            data: detailHistoryQuiz,
        });
    } catch (error) {
        console.error('Error upserting detail history quiz:', error);
        res.status(500).json({ error: 'Failed to upsert detail history quiz' });
    }
};

module.exports = {
    getAllDetailHistQuizByHistQuizID,
    getDetailHistoryQuizData,
    upsertDetailHistoryQuiz
};