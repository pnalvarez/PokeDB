const auth = require('../middleware/auth')
const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const admin = require('../middleware/admin')
const { Pokemon,
       Trainer,
       createPokemon,
       updatePokemon,
       deletePokemon,
       pokemonExists } = require('../model/pokemon')


mongoose.connect('mongodb://localhost/playground', {useMongoClient: true})
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

router.post('',auth, async (req,res)=>{

    const pokemon = new Pokemon({name: req.body.name,
                                 pokeType: req.body.pokeType
                                })
            
    try {
        const result = await pokemon.save()
        console.log(result)
        res.status(200).send(result)
    }
    catch {
        res.status(400).send('Failed')
    }
})

router.put('/:id',async (req,res)=>{

    const id = req.params.id
    const name = req.body.name
    const pokeType = req.body.pokeType
    const exists = await pokemonExists(id)

    if(!exists){
        res.status(400).send('Pokemon does not exist')
        return
    }
    const result = await updatePokemon(id, name, pokeType)
    res.status(200).send(result)
})

router.delete('/:id',[auth,admin],async (req,res)=>{
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