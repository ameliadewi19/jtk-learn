const express = require('express');
const { 
    getAllMateri, 
    createMateri, 
    updateMateri, 
    deleteMateri,
    getMateriById,
    upsertHistoryMateri 
} = require('../controllers/materiController');
const router = express.Router();
const uploadMaterial = require('../middleware/uploadMaterial');

// Routes for Materi
router.get('/course/:id', getAllMateri); // Get all materi by course ID
router.post('/', uploadMaterial.single('konten_materi'), createMateri); // Create a new materi
router.put('/:id', uploadMaterial.single('konten_materi'), updateMateri); // Update materi by ID
router.delete('/:id', deleteMateri); // Delete materi by ID
router.get('/:id', getMateriById); // Get materi by ID
router.put('/:id_pelajar/:id_materi',upsertHistoryMateri); //update, create if not exist

module.exports = router;
