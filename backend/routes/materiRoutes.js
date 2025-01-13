const express = require('express');
const { 
    getAllMateri, 
    createMateri, 
    updateMateri, 
    deleteMateri 
} = require('../controllers/materiController');
const router = express.Router();

// Routes for Materi
router.get('/course/:id', getAllMateri); // Get all materi by course ID
router.post('/', createMateri); // Create a new materi
router.put('/:id', updateMateri); // Update materi by ID
router.delete('/:id', deleteMateri); // Delete materi by ID

module.exports = router;
