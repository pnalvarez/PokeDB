const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const { User } = require('../model/user')
const bcrypt = require('bcrypt')
const _ = require('lodash')

router.post('/',async(req,res)=>{
    const {error} = validate(req.body)
    if(error) return res.status(400).send(error.details[0].message)

    let user = await User.findOne({email: req.body.email})
    if(!user) return res.status(400).send('Invalid email or password')

    const validpassword = await bcrypt.compare(req.body.password, user.password)
    if(!validpassword) return res.status(400).send('Invalid email or password')

    res.send(true)
})

function validate(req) {
    const schema = {
        name: Joi.string().min(5).max(50).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required()
    }
    return Joi.validate(user, schema)
}

module.exports = router