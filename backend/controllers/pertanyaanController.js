const { Pertanyaan, Quiz } = require('../models');

// get all pertanyaan for one quiz
const getAllPertanyaan = async (id_quiz) => {
    try {
        const pertanyaan = await Pertanyaan.findAll({
            where: { id_quiz },
            include: [{ model: Quiz, as: 'quiz' }],
        });
        return pertanyaan;
    } catch (error) {
        console.error(error);
        throw new Error(error.message);
    }
};

// create new pertanyaan for a quiz
const createPertanyaan = async (id_quiz, nama_pertanyaan, konten_pertanyaan, jenis_pertanyaan, order, transaction) => {
    return await Pertanyaan.create({
        id_quiz,
        nama_pertanyaan,
        konten_pertanyaan,
        jenis_pertanyaan,
        order
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