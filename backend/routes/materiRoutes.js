const express = require('express');
const { 
    getAllMateri, 
    getMateriById, 
    createMateri, 
    updateMateri, 
    deleteMateri 
} = require('../controllers/materiController');
const router = express.Router();

// Routes for Materi
router.get('/', getAllMateri); // Get all materi
router.get('/:id', getMateriById); // Get materi by ID
router.post('/', createMateri); // Create a new materi
router.put('/:id', updateMateri); // Update materi by ID
router.delete('/:id', deleteMateri); // Delete materi by ID

module.exports = router;
