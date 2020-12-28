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

            res.json(user)
        })

})

router.put("/addItem/", (req, res)=> {
    console.log(req.body)

    Item.findById(req.body.item_id)
        .exec( (err, match)=> {
            if (err) return res.status(404).send(`Couldn't find the item you wanted to add`)

            if (req.user.items.includes(match._id)) {
                return res.send(`You have already added this item`)
            }            

            req.user.items.push(match)
            req.user.save((err)=> {
                if (err) return res.status(500).send(`Server error, couldn't update your list of items`)

                return res.send('added the item')
            })
        })        

})

module.exports = router