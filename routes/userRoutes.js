const express = require('express')
const { model } = require('mongoose')
const router = express.Router()

router.get('/', (req, res, next)=> {
    res.send('this route requires a token')
})

module.exports = router