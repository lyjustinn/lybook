const express = require('express')
const User = require('../models/user')
const Item = require('../models/item')
const router = express.Router()

router.get('/', (req, res, next)=> {
    res.send('this route requires a token')
})

router.get("/dashboard/", (req, res)=> {
    const id = req.user._id

    User.findById(id)
        .populate('items')
        .exec((err, user) => {
            if (err) { return next(err)}

            console.log(user)

            res.send(user.items)
        }).catch( err => {
            console.error(err)
            next(err)
        })

})

router.put("/addItem/", (req, res, next)=> {
    console.log(req.body)

    if (!req.body.itemid) return res.status(400).send(`No item id sent`)

    Item.findById(req.body.itemid)
        .exec( (err, match)=> {
            if (err) return next(err)
            if (match === undefined || match === null) return res.status(404).send(`Couldn't find the item you wanted to add`)

            if (req.user.items.includes(match._id)) {
                return res.send(`You have already added this item`)
            }            

            req.user.items.push(match)
            req.user.save((err)=> {
                if (err) return next(err)

                return res.send('added the item')
            })
        })
        .catch( err => {
            console.error(err)
            next(err)
        })        
})

router.put("/removeItem/", (req, res)=> {
    if (!req.body.itemid) return res.status(400).send(`No item id sent`)

    if (req.user.items.includes(req.body.itemid) === false) {
        return res.status(406).send(`The authenticated user is not tracking this item`)
    }     

    req.user.items.pull(req.body.itemid)
    req.user.save((err)=> {
        if (err) return next(err)

        return res.send(req.body.itemid)
    })
})

module.exports = router