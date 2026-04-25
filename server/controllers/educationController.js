const asyncHandler = require('express-async-handler')
const Education = require('../models/educationModel')
const User = require('../models/userModel')

// @desc    Get education entries
// @route   GET /api/education
// @access  Private
const getEducation = asyncHandler(async (req, res) => {
    const education = await Education.find({ user: req.user.id })
    res.status(200).json(education)
})

// @desc    Create education entry
// @route   POST /api/education
// @access  Private
const setEducation = asyncHandler(async (req, res) => {
    const { institution, qualification, startYear } = req.body
    if (!institution || !qualification || !startYear) {
        res.status(400)
        throw new Error('Please add all required fields')
    }

    const education = await Education.create({
        institution,
        qualification,
        gpa: req.body.gpa,
        startYear,
        endYear: req.body.endYear,
        user: req.user.id
    })
    res.status(201).json(education)
})

// @desc    Update education entry
// @route   PUT /api/education/:id
// @access  Private
const updateEducation = asyncHandler(async (req, res) => {
    const education = await Education.findById(req.params.id)

    if (!education) {
        res.status(400)
        throw new Error('Education not found')
    }

    const user = await User.findById(req.user.id)
    if (!user) {
        res.status(401)
        throw new Error('User not found')
    }

    if (education.user.toString() !== user.id) {
        res.status(401)
        throw new Error('User not authorized')
    }

    const updated = await Education.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    )

    res.status(200).json(updated)
})

// @desc    Delete education entry
// @route   DELETE /api/education/:id
// @access  Private
const deleteEducation = asyncHandler(async (req, res) => {
    const education = await Education.findById(req.params.id)

    if (!education) {
        res.status(400)
        throw new Error('Education not found')
    }

    const user = await User.findById(req.user.id)
    if (!user) {
        res.status(401)
        throw new Error('User not found')
    }

    if (education.user.toString() !== user.id) {
        res.status(401)
        throw new Error('User not authorized')
    }

    await education.deleteOne()

    res.status(200).json({ id: req.params.id })
})

module.exports = { getEducation, setEducation, updateEducation, deleteEducation }
