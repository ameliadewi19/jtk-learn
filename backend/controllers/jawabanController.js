const { Jawaban, Pertanyaan } = require('../models');

// get all jawaban for multiple choice question (where pertanyaan.jenis_pertanyaan = 'pilihan_ganda')
const getAllPilihanJawaban = async (req, res) => {
    try {
        const jawaban = await Jawaban.findAll({
            include: [
                {
                    model: Pertanyaan,
                    as: 'pertanyaan',
                    where: { jenis_pertanyaan: 'pilihan_ganda' },
                },
            ],
        });

        res.status(200).json(jawaban);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
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
    getAllPilihanJawaban,
    createJawaban,
    updateJawaban
};