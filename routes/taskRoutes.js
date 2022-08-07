const express = require('express')
const { newTaskForm, newTask, allTasks, taskDetails, editTaskForm, editTask, deleteTask } = require('../controllers/taskController')
const taskRouter = express.Router()
const catchAsync = require('../catchAsync').catchAsync

taskRouter.get('/', catchAsync(allTasks))

taskRouter.get('/new-task', newTaskForm)

taskRouter.post('/', catchAsync(newTask))

taskRouter.get('/:taskId', catchAsync(taskDetails))

taskRouter.get('/:taskId/edit', editTaskForm)

taskRouter.patch('/:taskId', catchAsync(editTask))

taskRouter.delete('/:taskId', catchAsync(deleteTask))

module.exports = taskRouter