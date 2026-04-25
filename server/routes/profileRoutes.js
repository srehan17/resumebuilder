const express = require('express')
const router = express.Router()
const { getProfile, setProfile, deleteProfile } = require('../controllers/profileController')
const { protect } = require('../middleware/authMiddleware')

router.route('/').get(protect, getProfile).post(protect, setProfile)
router.route('/').delete(protect, deleteProfile)

module.exports = router
