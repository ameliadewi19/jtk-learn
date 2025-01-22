const { Jawaban, Pertanyaan } = require('../models');

// get all jawaban by id pertanyaan
const getJawabanByIdPertanyaan = async (id_pertanyaan) => {
    try {
        const jawaban = await Jawaban.findAll({ where: { id_pertanyaan } });
        return jawaban;
    } catch (error) {
        console.error(error);
        throw new Error(error.message);
    }
};

const createJawaban = async (id_pertanyaan, nama_jawaban, konten_jawaban, status_jawaban, transaction) => {
    return await Jawaban.create({
        id_pertanyaan,
        nama_jawaban,
        konten_jawaban,
        status_jawaban
    }, { transaction });
};

// update jawaban
const updateJawaban = async (id, nama_jawaban, konten_jawaban, status_jawaban, transaction) => {
    const jawaban = await Jawaban.findByPk(id, { transaction });
    if (!jawaban) {
        throw new Error('Jawaban not found');
    }
    return await jawaban.update({
        nama_jawaban,
        konten_jawaban,
        status_jawaban
    }, { transaction });
};

module.exports = {
    getJawabanByIdPertanyaan,
    createJawaban,
    updateJawaban
};