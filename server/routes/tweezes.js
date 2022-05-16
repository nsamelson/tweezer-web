const express = require('express');
const router = express.Router();

const {
    getTweezes, 
    addTweez,
    getTweez,
    updateTweez,
    deleteTweez
       
    } = require('../controllers/tweez.controller');


router.get('/', getTweezes)
router.post('/',addTweez)
router.get('/:id',getTweez)
router.put('/:id',updateTweez)
router.delete('/:id',deleteTweez)

module.exports = router