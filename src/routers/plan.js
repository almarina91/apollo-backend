const express = require('express');
const router = new express.Router();

const Plan = require('../models/plan');
const Day = require('../models/day');
const Interval = require('../models/interval');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

const log = require('../utils/log');
const {STATUS_CODE, MESSAGE, ERROR} = require("../utils/enums");

const endpoint = '/plans';

/**
 * Gets all plans.
 * @const plans - contains all plans from db.
 * @function compare - assists in sorting days
 */

router.get(endpoint, async (req,res)=>{
    const plans = await Plan.find({});
    function compare(a, b) {
        if (a.orderNumber > b.orderNumber) return 1;
        if (b.orderNumber > a.orderNumber) return -1;
        return 0;
    }
    await plans.sort(compare);
    res.send(plans)
})

/**
 * Creates a new plan.
 * @const plan - creates a new plan based on request body.
 */

router.post(endpoint, auth, admin, async (req,res)=>{
    const plan = new Plan(req.body);
    try {
        await plan.save()
        res.status(STATUS_CODE.created).send(plan)
    }
    catch (e) {
        await log(e)
        res.status(STATUS_CODE.badRequest).send(e)
    }
})

/**
 * Loads a plan from a json file.
 * @const data - imports data form a file.
 * @const newPlanData - saves plan names in all languages.
 * @const newPlan - creates a new plan.
 * @const daysArray - array that contains all days for a plan.
 * @const intervalsArray - array that contains all intervals for a day.
 * @const orderNumberDays - helps keeping the days in order.
 * @const newIntervalData - contains all data for a interval.
 * @const newInterval - creates a new interval.
 */

router.post(`${endpoint}/json`, async (req, res)=>{
    const data = require('../data.json');
    try {
        data.forEach((plan) => {
           const newPlanData = {
               englishName: plan.englishName,
               italianName: plan.italianName,
               frenchName: plan.frenchName,
               serbianName: plan.serbianName,
               dutchName: plan.dutchName
           }
           const newPlan = new Plan(newPlanData);
           const daysArray = plan.days;
            let orderNumberDays = 1;
           daysArray.forEach(day => {
               const newDayData = {
                   englishName: day.englishName,
                   italianName: day.italianName,
                   frenchName: day.frenchName,
                   serbianName: day.serbianName,
                   dutchName: day.dutchName,
                   planID: newPlan._id,
                   orderNumber: orderNumberDays
               }
               orderNumberDays++;
               const newDay = new Day(newDayData);
               const intervalsArray = day.intervals;
               let orderNumberInt = 1;
               intervalsArray.forEach(interval => {
                   const newIntervalData = {
                       seconds: interval.seconds,
                       type: interval.type,
                       planID: newPlan._id,
                       dayID: newDay._id,
                       orderNumber: orderNumberInt
                   }
                   orderNumberInt ++;
                   const newInterval = new Interval(newIntervalData);
                   newInterval.save()
               })
               newDay.save()
           })
           newPlan.save()
        })
        res.send(MESSAGE.success)

    } catch (e) {
        res.status(STATUS_CODE.badRequest).send(e)
    }
})

/**
 * Updates a plan.
 * @const plan - finds a specific plan in db and updates it based on request body.
 */

router.patch(`${endpoint}/:id`, auth, admin, async(req, res)=>{
    try {
        const plan = await Plan.findByIdAndUpdate(req.params.id, req.body, {new:true, runValidators:true});
        plan ? res.send(plan) : res.status(400).send(ERROR.planNotFound)
    } catch (e) {
        await log(e)
        res.status(STATUS_CODE.badRequest).send(e);
    }
})

/**
 * Deletes a plan.
 * @const plan - finds a plan in db and removes it.
 */

router.delete(`${endpoint}/:id`, auth, admin, async (req, res)=>{
    try {
        const plan = await Plan.findByIdAndDelete(req.params.id);
        plan ?
            res.status(STATUS_CODE.ok).send(plan) :
            res.status(STATUS_CODE.badRequest).send(ERROR.planNotFound)
    } catch(e) {
        await log(e)
        res.status(STATUS_CODE.badRequest).send(e)
    }
})

module.exports = router;