// code for local strategy

const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const User = require('./models/user')

passport.use(
    new LocalStrategy((email, password, done) => {
        User.findOne({ email: email}, (err, user)=> {
            if (err) {
                return done(err);
            }
            if (!user) {
                return done(null, false, {msg: 'Incorrect Username!'});
            }
            console.log(password);
            
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

const passportJWT = require('passport-jwt')
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

passport.use( new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey: 'test'
    },
    function(jwtPayload, cb) {
        return User.findById(jwtPayload.id)
            .then(user => {
                return cb(null, user)
            })
            .catch(err => {
                return cb(err)
            })
    }
    
))