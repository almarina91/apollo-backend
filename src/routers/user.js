const express = require('express');
const router = new express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const User = require('../models/user');
const UserDay = require('../models/user-day');
const log = require('../utils/log');
const {STATUS_CODE, ERROR} = require("../utils/enums");

const endpoint = '/users';
const allowedUpdates = ['username', 'password', 'email', 'language', 'weight', 'height'];

/**
 * Gets users data.
 */

router.get(endpoint, auth, async (req,res)=>{
    res.status(STATUS_CODE.ok).send(req.user)
})

/**
 * Sign up a new user.
 * @const user - creates a new user in db.
 * @const token - generates a new token for a user.
 */

router.post(endpoint, async (req,res)=>{
    const user = new User({...req.body, role:'user'});
    try {
        const token = await user.generateAuthToken()
        await user.save()
        res.status(STATUS_CODE.created).send({user,token})
    } catch (e) {
        await log(e)
        res.status(STATUS_CODE.badRequest).send(e)
    }
})

/**
 * Logs in a user.
 * @const user - checks if a user exist in db.
 * @const token - creates a new token for a user.
 */

router.post(`${endpoint}/login`, async(req,res)=>{
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        res.send({user, token})
    } catch(e) {
        await log(e)
        res.status(STATUS_CODE.badRequest).send(e)
    }
})

/**
 * Logs out a user by removing the token.
 */

router.post(`${endpoint}/logout`, auth, async (req,res)=>{
    try {
        req.user.tokens = req.user.tokens.filter(token => {
            return token.token !== req.token
        })
        await req.user.save()
        res.status(STATUS_CODE.ok).send()
    } catch(e) {
        await log(e)
        res.status(STATUS_CODE.serverError).send(e);
    }
})

/**
 * Logs out a user by removing all of the tokens.
 */

router.post(`${endpoint}/logoutAll`, auth, async (req,res)=>{
    try {
        req.user.tokens = [];
        await req.user.save()
        res.status(STATUS_CODE.ok).send()
    } catch(e) {
        await log(e)
        res.status(STATUS_CODE.serverError).send()
    }
})

/**
 * Updates a user based on request body.
 * @const updates - contains all the updates the user has provided.
 * @const isValidOperation - checks if the updates the user provided are allowed.
 */

router.patch(`${endpoint}/me`, auth, async (req, res)=>{
    const updates = Object.keys(req.body);
    const isValidOperation = updates.every(update=>allowedUpdates.includes(update));
    if (!isValidOperation) {
        return res.status(STATUS_CODE.badRequest).send(ERROR.invalidUpdate)
    }
    try {
        updates.forEach(update=>{
            req.user[update]=req.body[update]
        })
        await req.user.save()
        res.status(STATUS_CODE.ok).send(req.user)
    } catch (e) {
        await log(e)
        res.status(STATUS_CODE.badRequest).send(e)
    }
})

/**
 * Allows admin to get all the users.
 * @const users - contains all users from db.
 */

router.get(`${endpoint}/usersList`, auth, admin,async (req,res)=>{
    const users = await User.find({});
    res.status(STATUS_CODE.ok).send(users)
})

/**
 * Allows admin to update a user.
 * @const updates - contains all the updates the user has provided.
 * @const isValidOperation - checks if the updates the user provided are allowed.
 * @const user - finds the user to be updated.
 */
router.patch(`${endpoint}/:id`, auth, admin,  async(req, res)=>{
    const updates = Object.keys(req.body);
    const isValidOperation = updates.every(update=>allowedUpdates.includes(update));
    const user = await User.findById(req.params.id);
    if (!isValidOperation) {
        return res.status(400).send(ERROR.invalidUpdate)
    }
    try {
        updates.forEach(update=>{
            user[update]=req.body[update]
        })
        await user.save()
        res.status(STATUS_CODE.ok).send(user)
    } catch (e) {
        await log(e)
        res.status(STATUS_CODE.badRequest).send(e)
    }
})

/**
 * Removes a user.
 */

router.delete(`${endpoint}/me`, auth, async(req, res)=>{
    try {
        await UserDay.getUserDaysAndRemove(req.user._id)
        await req.user.remove()
        res.status(STATUS_CODE.ok).send(req.user)
    } catch (e) {
        await log(e)
        res.status(STATUS_CODE.badRequest).send(e)
    }
})

/**
 * Allows admin to delete a user.
 * @const user - contains the data of a removed user.
 */

router.delete(`${endpoint}/:userID`, auth, admin, async(req, res)=>{
    try {
        await UserDay.getUserDaysAndRemove(req.params.userID)
        const user = await User.deleteOne({_id:req.params.userID})
        res.status(STATUS_CODE.ok).send(user)
    } catch (e) {
        await log(e)
        res.status(STATUS_CODE.badRequest).send(e)
    }
})

/**
 * Saves the day the user has finished.
 * @const newRelation - creates the new relation between user and the finished day.
 */

router.post(`${endpoint}/finishedDay/:dayID`, auth, async(req,res)=>{
    try {
        const newRelation = new UserDay({userID:req.user._id, dayID:req.params.dayID})
        await newRelation.save()
        res.status(STATUS_CODE.created).send(newRelation)
    } catch(e) {
        await log(e)
        res.status(STATUS_CODE.badRequest).send(e)
    }
})

/**
 * Gets all the days the user has finished.
 * @const finishedDays - contains all the days the user has finished.
 */

router.get(`${endpoint}/finishedDays`, auth, async(req,res)=>{
    try {
        const finishedDays = await UserDay.find({userID:req.user._id})
        res.status(STATUS_CODE.ok).send(finishedDays)
    } catch(e) {
        await log(e)
        res.status(STATUS_CODE.badRequest).send()
    }
})

module.exports = router;
