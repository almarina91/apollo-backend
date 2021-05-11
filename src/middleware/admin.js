const User = require('../models/user');
const err = require('../utils/errors')

const admin = async (req,res,next) =>{
    try {
        const user = await User.findOne({_id:req.user._id, role:'admin'});
        if (!user) {
            throw new Error()
        }
        next()
    } catch(e) {
        res.status(401).send({error:err.onlyAdmin})
    }
}

module.exports = admin;
