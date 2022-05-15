const express = require('express');
const router = express.Router();

const {
    getTweezes, 
    addTweez
       
    } = require('../controllers/tweez.controller');


router.get('/', getTweezes)
router.post('/',addTweez)


module.exports = router