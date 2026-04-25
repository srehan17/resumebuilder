const asyncHandler = require('express-async-handler')
const Experience = require('../models/experienceModel')
const User = require('../models/userModel')

// @desc    Get experiences
// @route   GET /api/experience
// @access  Private
const getExperiences = asyncHandler(async (req, res) => {
    const experience = await Experience.find({ user: req.user.id })
    res.status(200).json(experience)
})

// @desc    Set experience
// @route   POST /api/experience
// @access  Private
const setExperience = asyncHandler(async (req, res) => {
    const { company, position, startYear } = req.body
    if (!company || !position || !startYear) {
        res.status(400)
        throw new Error('Please add all required text fields')
    }

    const experience = await Experience.create({
        company,
        position,
        responsibilities: req.body.responsibilities,
        startYear,
        endYear: req.body.endYear,
        user: req.user.id
    })
    res.status(200).json(experience)
})

// @desc    Update experience
// @route   PUT /api/experience/:id
// @access  Private
const updateExperience = asyncHandler(async (req, res) => {
    const experience = await Experience.findById(req.params.id)

    if (!experience) {
        res.status(400)
        throw new Error('Experience not found')
    }

    const user = await User.findById(req.user.id)

    if (!user) {
        res.status(401)
        throw new Error('User not found')
    }

    if (experience.user.toString() !== user.id) {
        res.status(401)
        throw new Error('User not authorized')
    }

    const updatedExperience = await Experience.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    )

    res.status(200).json(updatedExperience)
})

// @desc    Delete experience
// @route   DELETE /api/experience/:id
// @access  Private
const deleteExperience = asyncHandler(async (req, res) => {
    const experience = await Experience.findById(req.params.id)

    if (!experience) {
        res.status(400)
        throw new Error('Experience not found')
    }

    const user = await User.findById(req.user.id)

    if (!user) {
        res.status(401)
        throw new Error('User not found')
    }

    if (experience.user.toString() !== user.id) {
        res.status(401)
        throw new Error('User not authorized')
    }

    await experience.deleteOne()

    res.status(200).json({ id: req.params.id })
})

module.exports = {
    getExperiences,
    setExperience,
    updateExperience,
    deleteExperience
}
