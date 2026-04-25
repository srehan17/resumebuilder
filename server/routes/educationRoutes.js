const express = require('express')
const router = express.Router()
const { getEducation, setEducation, updateEducation, deleteEducation } = require('../controllers/educationController')
const { protect } = require('../middleware/authMiddleware')

router.route('/').get(protect, getEducation).post(protect, setEducation)
router.route('/:id').put(protect, updateEducation).delete(protect, deleteEducation)

module.exports = router
