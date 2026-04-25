require('dotenv').config()
const connectDB = require('./config/db')
const app = require('./app')

const port = process.env.PORT || 5001

connectDB()

const server = app.listen(port, () => console.log(`App listening on Port ${port}`))

module.exports = { server, app }
