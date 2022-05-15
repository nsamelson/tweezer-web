const express = require('express');
const router = express.Router();


const {
    getRelationships,
    addRelationship,
    getRelationship,
    deleteRelationship
    } = require('../controllers/relationship.controller');


router.get('/',getRelationships)
router.post('/',addRelationship)
router.get('/:id',getRelationship)
router.delete('/:id',deleteRelationship)




module.exports = router