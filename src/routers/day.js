const express = require('express');
const router = new express.Router();

const Day = require('../models/day');

const endpoint = '/days';

/**
 * Gets all days for a specific plan via planID.
 * @const days - contains all days related to plan in db.
 * @function compare - assists in sorting days
 */

router.get(`${endpoint}/:planID`, async (req,res)=>{
    const days = await Day.find({planID: req.params.planID});
    function compare(a, b) {
        if (a.orderNumber > b.orderNumber) return 1;
        if (b.orderNumber > a.orderNumber) return -1;
        return 0;
    }
    await days.sort(compare);
    res.send(days)
})

module.exports = router;