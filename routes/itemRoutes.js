const express = require('express')
const puppeteer = require('puppeteer')
const CronJob = require('cron').CronJob

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

router.get("/getDashboard/", (req, res)=> {



    res.send('this is your dashboard')
})

module.exports = router