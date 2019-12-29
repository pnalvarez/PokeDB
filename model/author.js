const Joi = require('joi')
const mongoose = require('mongoose')

const authorSchema = new mongoose.Schema({
                                            name: String,
                                            bio: String,
                                            website: String
                                        })

const Author = new mongoose.model('Author', authorSchema)

module.exports.authorSchema = authorSchema
module.exports.Author = Author