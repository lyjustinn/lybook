const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const passport = require('passport')
const User = require('../models/user')
const bcrypt = require('bcrypt')

router.post('/signup', (req, res, next)=> {
    bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
        if (err) return next(err);
        
        const user = new User({
            email: req.body.email,
            password: hashedPassword,
        }).save(err => {
            if (err) {
                return next(err);
            };
            res.json(req.body)
        })
    })
})

router.post('/login', (req, res, next)=> {
    passport.authenticate('local', {session: false}, (err, user, info)=> {
        if (err || !user) {
            return res.status(400).json({
                message: "Something went wrong",
                user: user
            })
        }

        req.login(user, {session: false}, (err)=> {

            if (err) {
                res.send(err)
            }

            const token = jwt.sign({user}, 'test')

            return res.json({user, token})

        })
    })(req, res)

})

module.exports = router