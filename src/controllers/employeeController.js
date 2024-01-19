const employeeModel = require('../models/employeeModel')
const jwt = require('jsonwebtoken')

module.exports = {
    createEmployee: async (req, res) => {
        try {
            const { email } = req.body
            const findUniqueEmail = await employeeModel.findOne({ email: email })
            if (findUniqueEmail) {
                return res.status(400).send({ status: true, msg: "One user is availble with this email  .. so please try different email" })
            }
            let saveData = await employeeModel.create(req.body)
            return res.status(201).send({ status: true, msg: "Data created successfully", Data: saveData })
        } catch (error) {
            return res.status(500).send({ status: false, msg: error.message })
        }
    },

    login: async (req, res) => {
        try {
            let { email, password } = req.body
            let findUser = await employeeModel.findOne({ email: email, password: password });

            if (!findUser) {
                return res.status(404).send({ status: false, message: "Either emailId or password is incorrect" })
            }
            let token = jwt.sign({ employeeId: findUser._id }, "Secret-key", '1h')
            res.setHeader("token", token)
            return res.status(200).send({ Message: "LoggedIn successfully", Token: token })
        } catch (error) {
            return res.status(500).send({ status: false, message: error.message })
        }
    },

    fetchUserById: async (req, res) => {
        try {
            let findUser = await employeeModel.findOne({ id: req.params.employeeId }).select({ _id: 0 })
            if (!findUser) {
                return res.status(404).send({ status: false, msg: "Employee not found" })
            }
            return res.status(200).send({ status: true, Data: findUser })
        } catch (error) {
            return res.status(500).send({ status: false, message: error.message })
        }
    },

    fetchUser: async (req, res) => {
        try {
            let { page } = req.query
            if (!page) {
                page = 1
            }
            let findUser = await employeeModel.find().select({ _id: 0 }).skip(2 * (page - 1)).limit(10)
            return res.status(200).send({ status: true, Data: findUser })
        } catch (error) {
            return res.status(500).send({ status: false, message: error.message })
        }
    },

    fetchUserByFilter: async (req, res) => {
        try {
            const { department, position } = req.query;
            const keyword = req.body
            // Build the MongoDB query based on filters
            const query = {};
            if (department) {
                query.department = department
            }
            if (position) {
                query.position = position
            }
            if (keyword) {
                query.$or = [
                    { firstName: { $regex: keyword, $options: 'i' } }, // 'i' for case-insensitive
                    { lastName: { $regex: keyword, $options: 'i' } }
                ];
            }

            // Exclude sensitive fields from the response
            const projection = { email: 0, password: 0, createdAt: 0, updatedAt: 0 };
            let findUser = await studentModel.find(query, projection).sort({position: 1})
            if (!findUser) {
                return res.status(404).send({ status: false, msg: 'Employee not found' })
            }
            return res.status(200).send({ status: true, User: findUser })
        } catch (error) {
            return res.status(500).send({ status: false, message: error.message })
        }
    },

    updateUser: async (req, res) => {
        try {
            let { employeeId } = req.params
            if (Object.keys(data).length < 1) {
                return res.status(400).send({ status: false, message: "Please enter data whatever you want to update" })
            }
            
            req.body.updatedAt = new Date().toLocaleString()
            let updateData = await employeeModel.findByIdAndUpdate(employeeId, req.body, { new: true })
            if (!updateData) {
                return res.status(404).send({ status: false, msg: "Employee not found" })
            }
            return res.status(200).send({ status: true, Data: updateData })
        } catch (error) {
            return res.status(500).send({ status: false, message: error.message })
        }
    },

    deleteUser: async (req, res) => {
        try {
            let deleteData = await employeeModel.findByIdAndDelete(req.params.employeeId)
            if (!deleteData) {
                return res.status(404).send({ status: false, msg: "Employee not found" })
            }
            return res.status(204).send({ status: true, msg: 'Employee account deleted successfully' })
        } catch (error) {
            return res.status(500).send({ status: false, message: error.message })
        }
    }
}

