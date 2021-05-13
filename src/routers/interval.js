const express = require('express');
const router = new express.Router();

const Interval = require('../models/interval');
const auth = require('../middleware/auth');

const endpoint = '/intervals';

// get all intervals for a specific day
router.get(`${endpoint}/:dayID`, async (req,res)=>{
    let intervals = await Interval.find({dayID:req.params.dayID});
    function compare(a, b) {
        if (a.orderNumber > b.orderNumber) return 1;
        if (b.orderNumber > a.orderNumber) return -1;
        return 0;
    }
    await intervals.sort(compare);
    res.send(intervals);
})



module.exports = router;