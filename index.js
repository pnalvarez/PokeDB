const express = require('express')
const config = require('config')
const helmet = require('helmet')
const startupDebugger = require('debug')('app:startup')
const dbDebugger = require('debug')('app:db')
const Logger = require('./logger')
const app = express()
const morgan = require('morgan')
const log = Logger.log
const pokemon = require('./routes/pokemons')
const app2 = require('./app')
const gamesRouter = require('./routes/games')
const users = require('./routes/users')
const Fawn = require('fawn')

console.log('app: ', app.get('env'))

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static('public'))
app.use(helmet())
app.use('/pokemon',pokemon)
app.use('/games', gamesRouter)
app.use('/', app2)
app.use('/users',users)

app.set('view engine', 'pug')
app.set('views', './views')

//Db work..
dbDebugger('Connected to the database')
startupDebugger('Startup')

app.listen(3000, ()=>{ console.log('Listen to port 3000')})

if(app.get('env') === 'development'){
    app.use(morgan('tiny'))
    dbDebugger('db debugger')
}

