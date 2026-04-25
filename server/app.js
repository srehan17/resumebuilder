const express = require('express')
const { errorHandler } = require('./middleware/errorHandler')

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/api/users', require('./routes/userRoutes'))
app.use('/api/experience', require('./routes/experienceRoutes'))
app.use('/api/education', require('./routes/educationRoutes'))
app.use('/api/profile', require('./routes/profileRoutes'))

app.use(errorHandler)

module.exports = app
