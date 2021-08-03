const express = require('express');
const router = new express.Router();

const Interval = require('../models/interval');

const endpoint = '/intervals';

/**
 * Gets all intervals for a specific day.
 * @let intervals - contains all intervals related to a day in db.
 * @function compare - assists in sorting days
 */

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