const {
    Quiz,
    DetailHistoryQuiz,
    HistoryQuiz,
    Pelajar,
    Pertanyaan,
    Jawaban,
  } = require("../models");
  const jawaban = require("../models/jawaban");
  
  const getAllDetailHistQuizByHistQuizID = async (req, res) => {
    try {
      const { id_history_quiz } = req.params;
      const historyQuizDetails = await DetailHistoryQuiz.findAll({
        where: { id_history_quiz },
        include: [
          {
            model: HistoryQuiz,
            as: "history_quiz",
            include: [
              {
                model: Pelajar,
                as: "pelajar",
                attributes: ["nama"], // Ambil nama pelajar
              },
            ],
            attributes: ["nilai"], // Ambil nilai quiz
          },
          {
            model: Pertanyaan,
            as: "pertanyaan",
          },
          {
            model: Jawaban,
            as: "jawaban",
          },
        ],
      });
      res.status(200).json(historyQuizDetails);
    } catch (error) {
      console.error("Error fetching history quiz details:", error);
      res.status(500).json({ error: "Failed to fetch history quiz details" });
    }
  };
  
  const getDetailHistoryQuizData = async (req, res) => {
    try {
      const { id_quiz } = req.params;
      const detailHistoryQuizData = await DetailHistoryQuiz.findAll({
        include: [
          {
            model: HistoryQuiz,
            as: "history_quiz",
            where: { id_quiz }, // Find based on id_quiz
            include: [
              {
                model: Pelajar,
                as: "pelajar",
                attributes: ["nama"], // Get the student name
              },
            ],
            attributes: ["nilai"], // Get the total grades
          },
          {
            model: Pertanyaan,
            as: "pertanyaan",
            attributes: ["jenis_pertanyaan"], // Get the question type
          },
        ],
        attributes: ["status"], // Get the status
      });
  
      // Transform the data into the desired structure
      const transformedData = detailHistoryQuizData.reduce((acc, item) => {
        const studentName = item.history_quiz.pelajar.nama;
        const nilai = item.history_quiz.nilai;
        const jenisPertanyaan = item.pertanyaan.jenis_pertanyaan;
        const status = item.status;
  
        let student = acc.find((s) => s.student_name === studentName);
        if (!student) {
          student = {
            student_name: studentName,
            nilai: nilai,
            detail: [],
          };
          acc.push(student);
        }
  
        student.detail.push({
          jenis_pertanyaan: jenisPertanyaan,
          status: status,
        });
  
        return acc;
      }, []);
  
      res.json(transformedData);
    } catch (error) {
      console.error("Error fetching detail history quiz data:", error);
      res.status(500).json({ error: "Failed to fetch detail history quiz data" });
    }
  };
  
  const getDetailHistoryQuizPelajar = async (req, res) => {
    try {
      const { id_pelajar, id_quiz } = req.params;
      // console.log('id_pelajar:', id_pelajar, 'id_quiz:', id_quiz);  // Debugging step
      const detailHistoryQuizData = await DetailHistoryQuiz.findAll({
        include: [
          {
            model: HistoryQuiz,
            as: "history_quiz",
            where: { id_pelajar, id_quiz },
            include: [
              {
                model: Pelajar,
                as: "pelajar",
              },
              {
                model: Quiz,
                as: "quiz",
                attributes: ["nama_quiz"], // Ambil hanya nama quiz
              },
            ],
          },
          {
            model: Pertanyaan,
            as: "pertanyaan",
          },
        ],
      });
  
      // Transform the data into the desired structure
      const transformedData = detailHistoryQuizData.reduce((acc, item) => {
        const studentName = item.history_quiz.pelajar.nama;
        const idHistoryQuiz = item.id_history_quiz;
        const nilai = item.history_quiz.nilai;
        const jenisPertanyaan = item.pertanyaan.jenis_pertanyaan;
        const status = item.status;
        const quizId = item.history_quiz.id_quiz;
        const quizName = item.history_quiz.quiz.nama_quiz;
  
        let student = acc.find((s) => s.student_name === studentName);
        if (!student) {
          student = {
            student_name: studentName,
            nilai: nilai,
            id_quiz: quizId,
            nama_quiz: quizName,
            history_quiz: [],
          };
          acc.push(student);
        }
  
        let history = student.history_quiz.find(
          (h) => h.id_history_quiz === idHistoryQuiz
        );
        if (!history) {
          history = {
            id_history_quiz: idHistoryQuiz,
            correct_count: 0, // Inisialisasi jumlah status 'benar'
            detail: [],
          };
          student.history_quiz.push(history);
        }
  
        history.detail.push({
          jenis_pertanyaan: jenisPertanyaan,
          status: status,
        });
  
        if (status === "benar") {
          history.correct_count += 1;
        }
  
        return acc;
      }, []);
  
      console.log(transformedData);
  
      return res.json(transformedData);
    } catch (error) {
      console.error("Error fetching detail history quiz data:", error);
      return res
        .status(500)
        .json({ error: "Failed to fetch detail history quiz data" });
    }
  };
  
  const upsertDetailHistoryQuiz = async (req, res) => {
    try {
      const { id_history_quiz, id_pertanyaan, id_jawaban, jawaban_text, status } =
        req.body;
  
      // Validasi input
      if (!id_history_quiz || !id_pertanyaan) {
        return res
          .status(400)
          .json({ error: "id_history_quiz dan id_pertanyaan wajib diisi" });
      }
  
      // Periksa apakah data sudah ada
      const existingDetail = await DetailHistoryQuiz.findOne({
        where: { id_history_quiz, id_pertanyaan },
      });
  
      if (existingDetail) {
        const updateData = {};
        updateData.id_pertanyaan = id_pertanyaan;
  
        if (jawaban_text !== null) {
          updateData.jawaban_text = jawaban_text;
        }
  
        if (id_jawaban !== null) {
          updateData.id_jawaban = id_jawaban;
        }
        updateData.updatedAt = new Date(); // Tetap perbarui updatedAt
  
        await existingDetail.update(updateData);
  
        return res.json({
          message: "DetailHistoryQuiz updated successfully",
          data: existingDetail,
        });
      } else {
        // Insert data jika belum ada
        const newDetail = await DetailHistoryQuiz.create({
          id_history_quiz,
          id_pertanyaan,
          id_jawaban,
          jawaban_text: jawaban_text || null,
          status,
        });
  
        return res.json({
          message: "DetailHistoryQuiz created successfully",
          data: newDetail,
        });
      }
    } catch (error) {
      console.error("Error upserting detail history quiz:", error);
      res.status(500).json({ error: "Failed to upsert detail history quiz" });
    }
  };
  
  module.exports = {
    getAllDetailHistQuizByHistQuizID,
    getDetailHistoryQuizPelajar,
    getDetailHistoryQuizData,
    upsertDetailHistoryQuiz,
  };
  