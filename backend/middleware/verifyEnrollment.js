const { CourseParticipant } = require('../models'); 

const verifyEnrollment = async (req, res, next) => {
    try {
        const id_pelajar = req.user.userId; // From JWT
        const id = req.params.id_course; // Benar

        if (!id) {
            return res.status(400).json({ message: "Course ID is required." });
        }

        // Check if the student is enrolled in the course
        const participant = await CourseParticipant.findOne({
            where: { id_course: id, id_pelajar },
        });

        if (!participant) {
            return res.status(403).json({ message: "Anda belum terdaftar di course ini." });
        }

        next(); // Proceed to the next middleware
    } catch (error) {
        console.error("Error verifying enrollment:", error);
        res.status(500).json({ message: "Terjadi kesalahan pada server." });
    }
};

module.exports = { verifyEnrollment };