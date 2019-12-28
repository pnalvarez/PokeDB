const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const { Pokemon,
       createPokemon,
       updatePokemon,
       deletePokemon,
       pokemonExists } = require('../model/pokemon')

mongoose.connect('mongodb://localhost/playground')
        .then(()=>{
            console.log('Connected to MongoDB')
        })
        .catch(()=>{
            console.log('Error to connect to MongoDB')
        })

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

module.exports = router