const { Pertanyaan, Quiz } = require('../models');

// get all pertanyaan for one quiz
const getAllPertanyaan = async (req, res) => {
    try {
        const { id_quiz } = req.params;
        const pertanyaan = await Pertanyaan.findAll({
            where: { id_quiz },
            include: [{ model: Quiz, as: 'quiz' }],
        });

        res.status(200).json(pertanyaan);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

// create new pertanyaan for a quiz
const createPertanyaan = async (id_quiz, nama_pertanyaan, konten_pertanyaan, jenis_pertanyaan, transaction) => {
    return await Pertanyaan.create({
        id_quiz,
        nama_pertanyaan,
        konten_pertanyaan,
        jenis_pertanyaan
    }, { transaction });
};

// update pertanyaan
const updatePertanyaan = async (id, nama_pertanyaan, konten_pertanyaan, jenis_pertanyaan, transaction) => {
    const pertanyaan = await Pertanyaan.findByPk(id, { transaction });
    if (!pertanyaan) {
        throw new Error('Pertanyaan not found');
    }
    return await pertanyaan.update({
        nama_pertanyaan,
        konten_pertanyaan,
        jenis_pertanyaan
    }, { transaction });
};

module.exports = {
    getAllPertanyaan,
    createPertanyaan,
    updatePertanyaan
};