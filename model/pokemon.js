const Joi = require('joi')
const mongoose = require('mongoose')

const trainerSchema = new mongoose.Schema({
    name: {type: String, required: true, minlength: 5},
    age: Number,
    pokemonNumber: {type: Number,
                    validate: v => {return v >= 0 && v < 7},
                    required: true
                   }
})

const pokemonSchema = new mongoose.Schema({
         name: {type: String, required: true, minlength: 3},
         pokeType: {type: String,
                    enum: ['water', 'fire', 'grass'],
                    default: 'water',
                    required: true
                    },
        trainer: {
                    type: trainerSchema
        }
})

const Pokemon = mongoose.model('Pokemon', pokemonSchema)
const Trainer = mongoose.model('Trainer', trainerSchema)

const createPokemon = async (name, trainer) => {
    console.log('pokemon is', name)
    const pokemon = new Pokemon({
        name: name,
        trainer: trainer
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

async function updatePokemon(id, name, pokeType) {
    const pokemon = await Pokemon.findByIdAndUpdate(id, {$set:
        {name: name,
         pokeType: pokeType }
        })
    return pokemon
}

const deletePokemon = async (id) => {
    const result = await Pokemon.deleteOne({_id: id})
    return result
}

async function createTrainers() {
    const trainer1 = new Trainer({name: 'Pedro', 'age': 25, 'pokemonNumber': 2})
    const result = await trainer1.save()
}

createTrainers()

module.exports.Pokemon = Pokemon
module.exports.Trainer = Trainer
module.exports.updatePokemon = updatePokemon
module.exports.deletePokemon = deletePokemon
module.exports.pokemonExists = pokemonExists
module.exports.createPokemon = createPokemon