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

            res.json({msg: 'Your account has been created'})
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

            const token = jwt.sign({user}, 'test', {expiresIn: '30m'})
            
            console.log(user, info)
            return res.json({user, token})

        })
    })(req, res)

})

router.use('/ping', passport.authenticate('jwt', {session: false}), (req, res)=> {
    console.log(req.user)
    res.json({msg: "Token is valid"})
})


module.exports = router