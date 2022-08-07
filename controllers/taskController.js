const Task = require("../models/taskModel")

function formatDate(rawDate) {
    const date = new Date(rawDate)
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

exports.allTasks = async (req, res, next) => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    const { date: tasksDueOn } = req.query

    let d = new Date(tasksDueOn)    //tasksDueOn might be in wrong format or anything
    if (isNaN(d)) d = new Date(Date.now())  //detecting if invalid date

    const date = d.getDate()
    const month = months[d.getMonth()]
    const year = d.getFullYear()
    const fullDate = formatDate(d)

    const tasks = await Task.find({ dueDate: { "$gte": new Date(fullDate), "$lt": new Date(new Date(fullDate).getTime() + (24 * 60 * 60 * 1000)) } })
    //Find only the tasks for today.
    const formattedTasks = tasks.map(task => {
        const createdOn = new Date(task.createdOn)
        return {
            ...task._doc,   //FIX THIS
            createdOn: formatDate(createdOn)
        }
    })

    res.render('allTasks.ejs', { date, month, year, fullDate, tasks: formattedTasks })
}

exports.taskDetails = async (req, res, next) => {
    const { taskId } = req.params
    const task = await Task.findById(taskId)    //raise 404 if not found
    if (!task) {
        next(new Error("404 page not found."))
    }
    res.render('taskDetails', { task })
}

exports.newTaskForm = (req, res, next) => {
    res.render('newTask.ejs')
}

exports.newTask = async (req, res, next) => {
    const { title, description, dueDate } = req.body
    if (!title || !dueDate) next(new Error("Details missing."))
    const newTask = await Task.create({
        title,
        description,
        dueDate     //currently we allow dates to be in the past.
    })
    res.redirect('/tasks')
}

exports.editTaskForm = async (req, res, next) => {
    const { taskId } = req.params
    const task = await Task.findById(taskId)    //if not found throw 404 error
    if (!task) {
        next(new Error("404 page not found."))
    }
    res.render('editTask.ejs', { task })
}

exports.editTask = async (req, res, next) => {
    const { taskId } = req.params
    if (!req.body.title || !req.body.dueDate) next(new Error("Details missing."))

    const task = await Task.findByIdAndUpdate(taskId, {
        title: req.body.title,
        dueDate: req.body.dueDate,
        description: req.body.description
    }, { new: true, runValidators: true })    //if not found throw 404 error
    res.redirect('/tasks')
}

exports.deleteTask = async (req, res, next) => {
    const { taskId } = req.params
    await Task.findByIdAndDelete(taskId)
    res.redirect('/tasks')
}