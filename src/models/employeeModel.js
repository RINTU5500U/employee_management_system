const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase : true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    dob: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true,
    },
    position: {
        type: String,
        required: true,
    },
    createdAt: { 
        type: String,
        default: new Date().toLocaleString()
    },
    updateAt: {
        type: String,
        default: null
    }
});

module.exports = mongoose.model('Employee', employeeSchema)