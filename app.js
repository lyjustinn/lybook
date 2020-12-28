const express = require('express')
const cors = require('cors')
const passport = require('passport');
const passportJWT = require('passport-jwt');
const bcrypt = require('bcrypt')
const scraper = require('./scraper/scraper')
const CronJob = require('cron').CronJob
const mongoose = require('mongoose')
require('dotenv').config();

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

const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

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
                    // console.log('here')
                    return done(null, false, {msg: "Incorrect Password"})
                }
            })
        })
    })
)

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

// SET UP CRON JOB
const job = new CronJob('*/5 * * * * *', ()=> {
            console.log('hello')
            // replace with scraper.scraper() 
        })
// job.start()

// SET UP ROUTERS AND ROUTES
app.get(("/"), (req, res)=> {
    res.send("hello world")
})
app.use('/user', passport.authenticate('jwt', {session:false}), user)

app.use('/items', passport.authenticate('jwt', {session:false}), items)

app.get('/scrapers',async (req,res)=> {
    await scraper.scraper()
    res.send('done')
})

// START APP
app.listen(PORT, ()=> console.log(`listening on port ${PORT}`))