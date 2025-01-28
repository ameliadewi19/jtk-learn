const express = require('express');
const { 
    getAllMateri, 
    createMateri, 
    updateMateri, 
    deleteMateri,
    createHistoryMateri,
    updateHistoryMateri 
} = require('../controllers/materiController');
const router = express.Router();

// Routes for Materi
router.get('/course/:id', getAllMateri); // Get all materi by course ID
router.post('/', createMateri); // Create a new materi
router.put('/:id', updateMateri); // Update materi by ID
router.delete('/:id', deleteMateri); // Delete materi by ID
router.post('/',createHistoryMateri);
router.put('/:id', updateHistoryMateri);

module.exports = router;
