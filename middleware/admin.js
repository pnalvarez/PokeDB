module.exports = function (req,res,next) {
    if(!req.user.isAdmin) return res.status(402).send('Access denied')
    next()
}