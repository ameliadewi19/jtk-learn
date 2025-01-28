const { Course, Pelajar, CourseParticipant, Pengajar } = require('../models');

const getCParticipantByStudent = async (req, res) => {
    try {
        const {id} = req.params;
        const courseParticipants = await CourseParticipant.findAll({
            where: { id_pelajar: id },
            include: [
              {
                model: Course,
                as: 'course', // Pastikan alias sesuai dengan definisi di model
                include: [
                  {
                    model: Pengajar,
                    as: 'pengajar',
                  }
                ]
              },
              {
                model: Pelajar,
                as: 'pelajar', // Pastikan alias sesuai dengan definisi di model
              },
            ],
        });
        if (courseParticipants.length === 0) {
            return res.status(404).json({ message: 'No course participant found.' });
        }
      
        res.status(200).json(courseParticipants);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch course participant.' });
    }
};

const updateParticipant = async (req, res) => {
  try {
    const { id_pelajar, id_course } = req.body;
    const { persentase_course, status_penyelesaian } = req.body;

    const courseParticipant = await CourseParticipant.findOne({
      where: { id_pelajar, id_course },
    });

    if (courseParticipant.length === 0) {
      return res.status(404).json({ message: 'No course participant found.' });
    }   
    
    await courseParticipant.update({ persentase_course, status_penyelesaian });
    res.status(200).json({ message: 'Course participant updated successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update course participant.' });
  }
};

const getProgressByCourse= async (req, res) => {
    try {
        const { id_course, id_pelajar } = req.params;
        const courseParticipant = await CourseParticipant.findOne({
            where: { id_course, id_pelajar },
        });
        if (!courseParticipant) {
            return res.status(404).json({ message: 'No progress found for this student.' });
        }
      
        res.status(200).json(courseParticipant);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch progress for the student.' });
    }
};

const enrollCourse = async (req, res) => {
    try {
        const { id_course, id_pelajar, enrollment_key } = req.body;

        const course = await Course.findOne({ where: { id_course } });
        if (course.enrollment_key !== enrollment_key) {
            return res.status(400).json({ message: 'Enrollment key yang Anda masukkan tidak valid. Silakan coba lagi.' });
        }

        await CourseParticipant.create({
            id_course: course.id_course,
            id_pelajar,
            persentase_course: 0,
            status_penyelesaian: 'In Progress',
        });

        return res.status(201).json({ message: 'Enroll berhasil! Anda sekarang dapat mengakses materi dan kuis course ini.' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
    }
}


module.exports = {
    getCParticipantByStudent,
    getProgressByCourse,
    enrollCourse,
    updateParticipant
}