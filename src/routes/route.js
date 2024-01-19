const express = require("express")
const router = express.Router()

const {createEmployee, login, updateUser, deleteUser, fetchUser, fetchUserByFilter, fetchUserById} = require('../controllers/employeeController')
const {authentication, authorization} = require('../middlewares/auth')

router.post('/employees', createEmployee)
router.post('/login', login)
router.get('/employees',authentication, fetchUser)
router.get('/employees/:employeeId', authentication, fetchUserById)
router.get('/employees', authentication, fetchUserByFilter)
router.put('/employees/:employeeId', authentication, authorization, updateUser)
router.delete('/employees/:employeeId', authentication, authorization, deleteUser)

router.all("/*", function (req, res) { 
    return res.status(400).send({ status: false, message: "invalid http request" });
});

module.exports = router