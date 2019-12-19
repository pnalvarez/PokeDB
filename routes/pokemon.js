const express = require('express')
const router = express.Router()
const Joi = require('joi')
const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/playground')
        .then(()=>{
            console.log('Connected to MongoDB')
        })
        .catch(()=>{
            console.log('Error to connect to MongoDB')
        })

const pokemonSchema = new mongoose.Schema({
                                            name: {type: String, required: true, minlength: 3}
                                          })
const Pokemon = mongoose.model('Pokemon', pokemonSchema)

router.get('', async (req,res)=>{
    const pokemon = await Pokemon.find()
    
    if(!pokemon){
        res.status(404).send('Pokemon not found')
        return
    }
    res.status(200).send(pokemon)
})

router.get('/:id', async (req,res)=>{
   
    const pokemon = await Pokemon.find({_id: req.params.id})
    
    if(pokemon){
        res.status(200).send(pokemon)
        return
    }
    res.status(400).send('Pokemon not found')
})

router.post('',async (req,res)=>{
    const pokemon = {
        name: req.body.name
    }

    const result = await createPokemon(pokemon.name)
    res.status(200).send(result)
})

router.put('/:id',async (req,res)=>{

    const id = req.params.id
    const name = req.body.name
    const exists = await pokemonExists(id)

    if(!exists){
        res.status(400).send('Pokemon does not exist')
        return
    }
    const result = await updatePokemon(id, name)
    res.status(200).send(result)
})

router.delete('/:id',async (req,res)=>{
    const id = req.params.id
    console.log(id)
    const exists = await pokemonExists(id)

    if(!exists){
        res.status(404).send('Pokemon not found')
        return
    }
    const result = await deletePokemon(id)
    res.status(200).send(result)
})

const createPokemon = async (name) => {
    console.log('pokemon is', name)
    const pokemon = new Pokemon({
        name: name
    })
    try {
        const result = await pokemon.save()
        console.log(result)
        return result
    }
    catch(err) {
        console.log(err.message)
    }
}

const pokemonExists =  async (id) => {
    const count = await Pokemon.find({_id: id}).count()
    console.log(count)
    if(count > 0){
        console.log('true')
        return true
    } 
    console.log('false')
    return false
}

const updatePokemon = async (id, name) => {
    const pokemon = await Pokemon.findByIdAndUpdate(id, {$set: {name: name}})
    return pokemon
}

const deletePokemon = async (id) => {
    const result = await Pokemon.deleteOne({_id: id})
    return result
}

module.exports = router