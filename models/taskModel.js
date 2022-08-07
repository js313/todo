const mongoose = require('mongoose')

const taskSchema = mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: true
    },
    description: String,
    createdOn: {
        type: Date,
        default: Date.now()
    },
    dueDate: {
        type: Date,
        required: true
    }
})

const Task = mongoose.model('Task', taskSchema)

module.exports = Task