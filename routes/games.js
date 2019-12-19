const express = require('express')
const router = express.Router()

const games = [
    {id: 0, name: 'Pokemon Blue', gen: 1},
    {id: 1, name: 'Pokemon Red', gen: 1},
    {id: 2, name: 'Pokemon Yellow', gen: 1},
    {id: 3, name: 'Pokemon Gold', gen: 2},
    {id: 4, name: 'Pokemon Silver', gen: 2}
]

router.get('',(req,res)=>{
    res.send(res.render('index',{title: 'My app', message: 'Games'}))
})

router.get('/:id',(req,res)=>{
    const game = games.find(game => game.id === parseInt(req.params.id))

    if(!game){
        console.log('ola')
        res.status(404).render('index', {title: 'Not found', message: '404'})
        return
    }

    res.render('index', {title: 'Game '+game.id,message: game.name})
})

router.post('/:name',(req,res)=>{
    const name = req.params.name
    if(gameExistsByName(name)){
        res.status(404).send('O jogo já existe')
        res.render('index', {title: 'Erro', message: 'O jogo já existe'})
        return
    }
    const newgame = {
        id: games.length,
        name: name
    }
    games.push(newgame)
})

router.put('/:id',(req,res)=>{
    const id = req.params.id
    console.log(id)
    const game = games.find(game => game.id === parseInt(id))

    if(!game){
        res.status(404).send('Game não existe')
        return
    }
    game.name = req.body.name
    res.status(200).send(game)
})

router.delete('/:id',(req,res)=>{
    const game = games.find(game => game.id === parseInt(req.params.id))

    if(!game){
        res.status(404).send('Jogo não existe')
        return
    }

    const id = game.id
    const {index} = parseInt(id)

    games.splice(index,1)
    res.status(200).send(games)
})

const gameExistsByName = (name)=>{
    const game = games.find(game => game.name === name)

    if(!game){
        return false
    }
    return true
}

const gameExistsById = (id) =>{
    const game = games.find(game => game.id === id)

    if(!game){
        return false
    }
    return true
}


module.exports = router