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
            return res.status(404).json({ message: 'No courses found for this student.' });
        }
      
        res.status(200).json(courseParticipants);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch courses for the student.' });
    }
};

module.exports = {
    getCParticipantByStudent
}