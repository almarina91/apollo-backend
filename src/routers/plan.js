const express = require('express');
const router = new express.Router();

const Plan = require('../models/plan');
const Day = require('../models/day');
const Interval = require('../models/interval');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

const log = require('../utils/log');
const err = require('../utils/errors');

const endpoint = '/plans';

// getting all plans
router.get(endpoint, async (req,res)=>{
    const plans = await Plan.find({});
    res.send(plans)
})

// creating a new plan
router.post(endpoint, auth, admin, async (req,res)=>{
    const plan = new Plan(req.body);
    try {
        await plan.save()
        res.status(201).send(plan)
    }
    catch (e) {
        await log(e)
        res.status(400).send(e)
    }
})

// loading plan from json file
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
        res.send('successful!')

    } catch (e) {
        res.status(400).send(e)
    }
})

// update a plan
router.patch(`${endpoint}/:id`, auth, admin, async(req, res)=>{
    try {
        const plan = await Plan.findByIdAndUpdate(req.params.id, req.body, {new:true, runValidators:true});
        plan ? res.send(plan) : res.status(400).send(err.planNotFound)
    } catch (e) {
        await log(e)
        res.status(400).send(e);
    }
})

// delete a plan
router.delete(`${endpoint}/:id`, auth, admin, async (req, res)=>{
    try {
        const plan = await Plan.findByIdAndDelete(req.params.id);
        plan ? res.status(200).send(plan) : res.status(400).send(err.planNotFound)
    } catch(e) {
        await log(e)
        res.status(400).send(e)
    }
})

module.exports = router;