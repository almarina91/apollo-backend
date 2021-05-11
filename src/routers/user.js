const express = require('express');
const router = new express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const User = require('../models/user');
const UserDay = require('../models/user-day');
const log = require('../utils/log');
const err = require('../utils/errors');
const endpoint = '/users';


// getting users info
router.get(endpoint, auth, async (req,res)=>{
    res.send(req.user)
})

// sign up a new user
router.post(endpoint, async (req,res)=>{
    const user = new User({...req.body, role:'user'});
    try {
        const token = await user.generateAuthToken()
        await user.save()
        res.status(201).send({user,token})
    } catch (e) {
        await log(e)
        res.status(400).send(e)
    }
})

// login a user
router.post(`${endpoint}/login`, async(req,res)=>{
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        res.send({user, token})
    } catch(e) {
        await log(e)
        res.status(400).send(e)
    }
})

// logout a user
router.post(`${endpoint}/logout`, auth, async (req,res)=>{
    try {
        req.user.tokens = req.user.tokens.filter(token => {
            return token.token !== req.token
        })
        await req.user.save()
        res.send()
    } catch(e) {
        await log(e)
        res.status(500).send(e);
    }
})

// logout a user from all sessions
router.post(`${endpoint}/logoutAll`, auth, async (req,res)=>{
    try {
        req.user.tokens = [];
        await req.user.save()
        res.send()
    } catch(e) {
        await log(e)
        res.status(500).send()
    }
})

// update a user
router.patch(`${endpoint}/me`, auth, async (req, res)=>{
    const updates = Object.keys(req.body);
    const allowedUpdates = ['username', 'password', 'email', 'language', 'weight', 'height'];
    const isValidOperation = updates.every(update=>allowedUpdates.includes(update));
    if (!isValidOperation) {
        return res.status(400).send(err.invalidUpdate)
    }
    try {
        updates.forEach(update=>{
            req.user[update]=req.body[update]
        })
        await req.user.save()
        res.send(req.user)
    } catch (e) {
        await log(e)
        res.status(400).send(e)
    }
})

// admin getting all users
router.get(`${endpoint}/usersList`, auth, admin,async (req,res)=>{
    const users = await User.find({});
    res.send(users)
})

// admin updates a user
router.patch(`${endpoint}/:id`, auth, admin,  async(req, res)=>{
    const updates = Object.keys(req.body);
    const allowedUpdates = ['username', 'password', 'email', 'language', 'weight', 'height'];
    const isValidOperation = updates.every(update=>allowedUpdates.includes(update));
    const user = await User.findById(req.params.id);
    if (!isValidOperation) {
        return res.status(400).send(err.invalidUpdate)
    }
    try {
        updates.forEach(update=>{
            user[update]=req.body[update]
        })
        await user.save()
        res.send(user)
    } catch (e) {
        await log(e)
        res.status(400).send(e)
    }
})

// delete a user
router.delete(`${endpoint}/me`, auth, async(req, res)=>{
    try {
        await UserDay.getUserDaysAndRemove(req.user._id)
        await req.user.remove()
        res.send(req.user)
    } catch (e) {
        await log(e)
        res.status(400).send(e)
    }
})

// admin deletes a user
router.delete(`${endpoint}/:userID`, auth, admin, async(req, res)=>{
    try {
        await UserDay.getUserDaysAndRemove(req.params.userID)
        const user = await User.deleteOne({_id:req.params.userID})
        res.send(user)
    } catch (e) {
        await log(e)
        res.status(400).send(e)
    }
})

// user finished a day
router.post(`${endpoint}/finishedDay/:dayID`, auth, async(req,res)=>{
    try {
        const newRelation = new UserDay({userID:req.user._id, dayID:req.params.dayID})
        await newRelation.save()
        res.status(201).send(newRelation)
    } catch(e) {
        await log(e)
        res.status(400).send(e)
    }
})

// getting all days that user finished
router.get(`${endpoint}/finishedDays`, auth, async(req,res)=>{
    try {
        const finishedDays = await UserDay.find({userID:req.user._id})
        res.status(200).send(finishedDays)
    } catch(e) {
        await log(e)
        res.status(400).send()
    }
})

module.exports = router;
