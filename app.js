const express = require('express')
const cors = require('cors')
const passport = require('passport');
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const puppeteer = require('puppeteer')
require('dotenv').config();
const scraper = require('./scraper/scraper')

// SET UP VARIABLES FOR USE
const app = express()
const PORT = 8888
const mongoDB = process.env.MONGO_DB
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "mongo connection error"));

const auth = require('./routes/auth')
const user = require('./routes/userRoutes')
const items = require('./routes/itemRoutes')

// SET UP MIDDLEWARE
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false}));
app.use(passport.initialize());
app.use('/auth', auth)

// SET UP PASSPORT
const LocalStrategy = require('passport-local').Strategy
const User = require('./models/user')

passport.use(
    new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    },
    (username, password, done) => {
        User.findOne({ email: username}, (err, user)=> {
            if (err) {
                return done(err);
            }
            if (!user) {
                console.log(password);
                return done(null, false, {msg: 'Incorrect Username!'});
            }
            
            bcrypt.compare( password, user.password, (err, res)=> {
                if (res) {
                    return done(null, user, {msg: "Logged in Successfully"})
                } else {
                    console.log('here')
                    return done(null, false, {msg: "Incorrect Password"})
                }
            })
        })
    })
)

// code for verifying tokens
const passportJWT = require('passport-jwt');
const Item = require('./models/item');
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

passport.use( new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey: 'test'
    },
    function(jwtPayload, cb) {
        return User.findById(jwtPayload.user._id)
            .then(user => {
                // console.log(jwtPayload)
                return cb(null, user)
            })
            .catch(err => {
                return cb(err)
            })
    }
    
))

// SET UP ROUTERS AND ROUTES

app.get(("/"), (req, res)=> {
    res.send("hello world")
})
app.use('/user', passport.authenticate('jwt', {session:false}), user)

app.use('/items', passport.authenticate('jwt', {session:false}), items)

app.get('/tracker', async (req, res)=> {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()

    const url = 'https://www.amazon.ca/Windows-10-Home-Bit-USB/dp/B08Q8P4R1X/ref=zg_bs_software_home_3?_encoding=UTF8&psc=1&refRID=6M8ZG9J1B2E6WC10GCPF'
    
    await page.goto(url)

    const [el] = await page.$x('//*[@id="landingImage"]')
    const src = await el.getProperty('src')
    const srcTxt = await src.jsonValue()

    // console.log(srcTxt)

    const [el2] = await page.$x('//*[@id="productTitle"]')
    const txt = await el2.getProperty('textContent')
    const rawText = await txt.jsonValue()

    // console.log(rawText)

    const [el3] = await page.$x('//*[@id="priceblock_ourprice"]')
    const txt2 = await el3.getProperty('textContent')
    const price = await txt2.jsonValue()

    await browser.close()

    console.log({srcTxt, rawText, price})

    res.send('tracking started')
})

app.get('/scrapers',async (req,res)=> {
    await scraper.scraper()
    res.send('done')
})

app.listen(PORT, ()=> console.log(`listening on port ${PORT}`))