const express = require('express')
const puppeteer = require('puppeteer')
const Item = require('../models/item')
const User = require('../models/user')
const scraper = require('../scraper/scraper')

const router = express.Router()

router.post('/newItem', async (req, res, next)=> {
    const {asin, name, link} = req.body
    console.log({asin, name, link})

    if (asin === undefined
        || name === undefined
        || link === undefined) 
        
        return res.status(400).send(`No item information sent`)

    const browser = await puppeteer.launch()
    const page = await browser.newPage()

    await Item.findOne({ASIN: asin}).exec(async (err, match) => {
        console.log(match)

        if (match !== null) {
            return res.json({item: match, msg: "This item has already been tracked, importing history..."})
        }

        let imgLink = null
        try {
            await page.goto(link)
            const [el] = await page.$x('//*[@id="landingImage"]')
            const src = await el.getProperty('src')
            imgLink = await src.jsonValue()

            await browser.close()
        } catch (error) {
            console.error(error)
            return res.status(404).send('bad link')
        }
    
        const newItem = new Item({
            name: name,
            ASIN: asin,
            link: link,
            image: imgLink
        }).save(async (error, doc)=> {
            if (error) return next(err)
            console.log(doc)
            await scraper.scrapeItem(doc)
            return res.json({item: doc, msg: "Created a new item, initializing history..."})
        })
    }) 
})

router.delete('/deleteItem', async (req, res, next)=> {
    if (!req.body.itemid) return res.status(400).send(`No item id sent`)

    Promise.all([
        User.findOne({ items: req.body.itemid}),
        Item.findById(req.body.itemid)
    ]).then ( async ([userMatch, itemMatch])=> {
        console.log({userMatch, itemMatch})

        if (!itemMatch) {
            return res.status(406).send(`Couldn't find an item with id ${req.body.itemid}`)
        }
        if (!userMatch) {
            await Item.deleteOne({_id: req.body.itemid})
            return res.send(`Deleted item with id ${req.body.itemid}`)
        }

        return res.status(406).send('This item is currently being tracked by one or more users, delete request refused')
    }).catch ((err) =>{
        next(err)
    })
})

module.exports = router