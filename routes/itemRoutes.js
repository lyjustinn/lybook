const express = require('express')
const puppeteer = require('puppeteer')
const CronJob = require('cron').CronJob
const Item = require('../models/item')

const router = express.Router()

// router.post(("/track"), (req, res)=> {
//     console.log(req.body)

//     if (req.body.msg === "hello") {
//         // var job = new CronJob('*/5 * * * * *', ()=> {
//         //     console.log('hello')
//         // })
//         // job.start()
//         return res.send("hello world")
//     }

//     res.send("no hello")
// })

router.post('/newItem', async (req, res)=> {
    const {asin, name, link} = req.body

    console.log({asin, name, link})

    const browser = await puppeteer.launch()
    const page = await browser.newPage()

    await Item.findOne({ASIN: asin}).exec(async (err, match) => {
        console.log(match)

        if (match !== null) {
            return res.json({item: match, msg: "This item has already been tracked, importing history..."})
        }

        try {
            await page.goto(link)
            await browser.close()
        } catch (error) {
            console.error(error)
            return res.status(404).send('bad link')
        }
    
        const newItem = new Item({
            name: name,
            ASIN: asin,
            link: link
        }).save(async (error, doc)=> {
            if (error) return next(err)
            console.log(doc)
            await scraper.scrapeItem(doc)
            return res.json({item: doc, msg: "Created a new item, initializing history..."})
        })
    }) 
})

module.exports = router