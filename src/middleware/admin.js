const User = require('../models/user');
const { ERROR, ROLE } = require('../utils/enums.js')

const admin = async (req,res,next) =>{
    try {
        const user = await User.findOne({_id:req.user._id, role:ROLE.admin});
        if (!user) {
            throw new Error()
        }
        next()
    } catch(e) {
        res.status(401).send({error:ERROR.onlyAdmin})
    }
}

module.exports = admin;
