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

module.exports = {
    getCParticipantByStudent,
    updateParticipant
}