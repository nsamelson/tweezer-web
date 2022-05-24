const express = require('express');
var multer  = require('multer')

// Setting up multer as a middleware to grab photo uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
// var upload = multer({ dest: 'uploads/' })


const router = express.Router();

const {
    getTweezes, 
    addTweez,
    getTweez,
    updateTweez,
    deleteTweez
       
    } = require('../controllers/tweez.controller');


router.get('/', getTweezes)
router.post('/',upload.single('file'),addTweez)
// router.post('/',addTweez)

router.get('/:id',getTweez)
router.put('/:id',updateTweez)
router.delete('/:id',deleteTweez)

module.exports = router