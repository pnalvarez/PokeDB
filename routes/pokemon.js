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

router.get('', (req,res)=>{
    res.render('index',{title: 'My Express App', message: 'Message'})
})

router.get('/:id', async (req,res)=>{
    // const pokemon = pokemons.find(pokemon => pokemon.id == parseInt(req.params.id))
    
    // if(!pokemon){
    //     res.status(404).send('pokemon not found')
    // }
    // res.send(pokemon.name)
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
    const exists = await pokemonExists(pokemon.name)

    if (exists){
        res.status(400).send('Pokemon already exists')
        return
    }
    const result = await createPokemon(pokemon.name)
    res.status(200).send(result)
})

router.put('/:id',(req,res)=>{
    const pokemon = pokemons.find(p=>p.id === parseInt(req.params.id))

    if(!pokemon){
       return res.status(400).send('Pokemon does not exist')
    }
    pokemon.name = req.body.name

    res.status(200).send(pokemon)
})

router.delete('/:id',(req,res)=>{
    const pokemon = pokemons.find(p=>p.id === parseInt(req.params.id))

    if(!pokemon){
       return res.status(400).send('Pokemon does not exist')
    }

    const {id} = pokemon.id
    const index = parseInt(id)

    pokemons.splice(index,1)
    res.send(pokemon)
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

const pokemonExists =  async (name) => {
    const count = await Pokemon.find({name: name}).count()
    console.log(count)
    if(count > 0){
        console.log('true')
        return true
    } 
    console.log('false')
    return false
}

module.exports = router