const Joi = require('joi')
const mongoose = require('mongoose')

const pokemonSchema = new mongoose.Schema({
                                            name: {type: String, required: true, minlength: 3}
                                          })
const Pokemon = mongoose.model('Pokemon', pokemonSchema)

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

module.exports.Pokemon = Pokemon
module.exports.updatePokemon = updatePokemon
module.exports.deletePokemon = deletePokemon
module.exports.pokemonExists = pokemonExists
module.exports.createPokemon = createPokemon