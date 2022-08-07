const mongoose = require('mongoose')
const express = require('express')
const app = express()
if (process.env.NODE_ENV !== "production") {
    require('dotenv').config({ path: './config.env' })
}
const path = require('path')
const ejsMate = require('ejs-mate')
const methodOverride = require('method-override')
const Task = require('./models/taskModel')
const taskRouter = require('./routes/taskRoutes')

mongoose.connect(process.env.MONGODB_URL)
    .then(() => console.log('Database Connected'))
    .catch((error) => console.log(error))

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.engine('ejs', ejsMate)  //to use boilerplate in ejs

app.use(methodOverride('_method'))  //enables us to make patch, put or delete requests from html forms

app.use(express.urlencoded({ extended: true }))   //'extended' is for nested objects
app.use(express.json())

app.use('/tasks', taskRouter)

app.get('/', (req, res) => {
    res.redirect('/tasks')
})

app.all('*', (req, res, next) => {
    next(new Error("404 page not found!"))
})

app.use((err, req, res, next) => {
    res.render('error.ejs', { error: { message: err.message || "Something went really wrong!!" } })
})

const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})