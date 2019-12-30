const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const { User, validate } = require('../model/user')
const bcrypt = require('bcrypt')
const _ = require('lodash')
const jwt = require('jsonwebtoken')
const config = require('config')
const auth = require('../middleware/auth')

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

    const token = user.generateAuthToken()

    const newUser = _.pick(user, ['_id','name','email'])
    res.header('x-auth-token', token).send(newUser)
})

router.get('/me',auth, async(req, res) => {
    const user = await User.findById(req.user._id).select('-password')
    res.send(user)
})

module.exports = router