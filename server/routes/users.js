const express = require('express');
const router = express.Router();

const {
    getUsers, 
    getUser,
    updateUser,
    deleteUser,
    addUser
       
    } = require('../controllers/user.controller');


router.get('/', getUsers)
router.post('/',addUser)
router.get('/:id', getUser)
router.put('/:id',updateUser)
router.delete('/:id', deleteUser)


module.exports = router

