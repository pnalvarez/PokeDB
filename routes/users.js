const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const { User, validate } = require('../model/user')
const bcrypt = require('bcrypt')
const _ = require('lodash')

router.post('/',async(req,res)=>{
    const {error} = validate(req.body)
    if(error) return res.status(400).send(error.details[0].message)

    let user = await User.findOne({email: req.body.email})
    if(user) return res.status(400).send('Email already registered')

    const salt = await bcrypt.genSalt(10)
    const password = await bcrypt.hash(req.body.password,salt)

    user = new User(_.pick(req.body, ['name','email','password']))
    user.password = password

    await user.save()

    const newUser = _.pick(user, ['_id','name','email'])

    res.send(newUser)
})

module.exports = router