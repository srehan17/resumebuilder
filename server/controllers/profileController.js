const asyncHandler = require('express-async-handler')
const Profile = require('../models/profileModel')

// @desc    Get current user's profile
// @route   GET /api/profile
// @access  Private
const getProfile = asyncHandler(async (req, res) => {
    const profile = await Profile.findOne({ user: req.user.id })
    res.status(200).json(profile)
})

// @desc    Create or update profile
// @route   POST /api/profile
// @access  Private
const setProfile = asyncHandler(async (req, res) => {
    const { name, phone } = req.body
    if (!name || !phone) {
        res.status(400)
        throw new Error('Please add all required fields')
    }

    const existing = await Profile.findOne({ user: req.user.id })

    if (existing) {
        const updated = await Profile.findByIdAndUpdate(
            existing._id,
            { ...req.body, user: req.user.id },
            { new: true }
        )
        return res.status(200).json(updated)
    }

    const profile = await Profile.create({ ...req.body, user: req.user.id })
    res.status(201).json(profile)
})

// @desc    Delete profile
// @route   DELETE /api/profile
// @access  Private
const deleteProfile = asyncHandler(async (req, res) => {
    const profile = await Profile.findOne({ user: req.user.id })

    if (!profile) {
        res.status(400)
        throw new Error('Profile not found')
    }

    await profile.deleteOne()
    res.status(200).json({ id: profile._id })
})

module.exports = { getProfile, setProfile, deleteProfile }
