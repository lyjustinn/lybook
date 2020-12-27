const express = require('express')
const cors = require('cors')
const CronJob = require('cron').CronJob
const { job } = require('cron')
const mongoose = require('mongoose')
require('dotenv').config();

const app = express()
const PORT = 8888
const mongoDB = process.env.MONGO_DB

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false}));

app.get(("/"), (req, res)=> {
    res.send("hello world")
})


app.post(("/track"), (req, res)=> {
    console.log(req.body)

    if (req.body.msg === "hello") {
        var job = new CronJob('*/5 * * * * *', ()=> {
            console.log('hello')
        })
        job.start()
        return res.send("hello world")
    }

    res.send("no hello")
})

app.use(express.static('/build'))

app.listen(PORT, ()=> console.log(`listening on port ${PORT}`))