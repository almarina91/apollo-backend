const express = require('express');
const router = new express.Router();

const Day = require('../models/day');
const auth = require('../middleware/auth');

const endpoint = '/days';

// get all days for a plan
router.get(`${endpoint}/:planID`, async (req,res)=>{
    const days = await Day.find({planID: req.params.planID});
    res.send(days)
})

module.exports = router;