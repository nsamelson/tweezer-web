const express = require('express');
const router = express.Router();

const {
    signup, 
    signin,
    getCurrentUser
       
    } = require('../controllers/auth.controller');



router.post('/signup', signup)
router.post('/signin', signin)
router.get('/user',getCurrentUser)


module.exports = router