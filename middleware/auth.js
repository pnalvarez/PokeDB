const jwt = require('jsonwebtoken')
const config = require('config')

module.exports = function (req, res, next) {
    const token = req.header('x-auth-token')
    if(!token) res.status(401).send('Access denied. Please provide a token')

    try {
        const decoded = jwt.verify(token,config.get('jwtPrivateKey'))
        req.user = decoded
        next()
    } catch(err) {
        res.status(400).send('Invalid token')
    }
}
