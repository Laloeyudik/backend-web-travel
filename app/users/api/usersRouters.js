const express = require("express")
const {ManagerUsers} = require("../domain/usersController.js")
const routUsers = express.Router()
const managerUsers = new ManagerUsers()

routUsers.get('/users', (req, res)=>{
    return managerUsers.getUsers(req,res)
})
routUsers.get('/users/by', (req, res)=>{
    return managerUsers.getUsers(res)
})
routUsers.post('/add/users', (req, res)=>{
    return managerUsers.addUsers(req,res)
})
routUsers.put('/update/users', (req, res)=>{
    return managerUsers.updateUsers(req,res)
})

routUsers.delete('/delete/users', (req, res)=>{
    return managerUsers.deleteUsers(req,res)
})

module.exports = routUsers