import passport from 'passport';
import {Strategy as LocalStrategy} from 'passport-local';
import {Strategy as TwitterStrategy} from 'passport-twitter';
import {Strategy as FacebookStrategy} from 'passport-facebook';

import cookieParser from 'cookie-parser'; // Parse Cookie header and populate req.cookies with an object keyed by the cookie names. Optionally you may enable signed cookie support by passing a secret string, which assigns req.secret so it may be used by other middleware.
import bodyParser from 'body-parser'; // The Body Parser object exposes various factories to create middlewares. All middlewares will populate the req.body property with the parsed body or provide an error to the callback -->https://www.npmjs.com/package/body-parser
import flash from 'connect-flash';

const port = process.env.PORT || 8000;

const FACEBOOK_APP_ID = '---INSERT FACEBOOK APP ID---';
const FACEBOOK_APP_SECRET = '---INSERT FACEBOOK APP SECRET---';
const FACEBOOK_CALLBACK_URL = `http://localhost:${port}/facebook/callback`;

const TWITTER_CONSUMER_KEY = '---INSERT TWITTER CONSUMER KEY---';
const TWITTER_CONSUMER_SECRET = 'INSERT TWITTER CONSUMER SECRET';
const TWITTER_CALLBACK_URL = `http://localhost:${port}/twitter/callback`;

export function configure (app) {
    app.use(flash());
    app.use(cookieParser());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(require('express-session')({
        secret: '-- USE PERSISTED SESSION LIKE REDIS IN PRODUCTION --',
        resave: false,
        saveUninitialized: false
    }));
    app.use(passport.initialize());
    app.use(passport.session());

    passport.use(new LocalStrategy(
        (username, password, done) => {
            if (username === password && username) return done(null, {username: username});
            return done(null, false, {message: 'Incorrect username or password'});
        }
    ));

    passport.use(new TwitterStrategy({
            consumerKey: TWITTER_CONSUMER_KEY,
            consumerSecret: TWITTER_CONSUMER_SECRET,
            callbackURL: TWITTER_CALLBACK_URL
        }, (token, tokenSecret, profile, done) => {
        var username = profile.username;
        if (username) return done(null, {username: username, name: profile.displayName, avatarUrl: profile._json.profile_image_url});
        return done(null, false, {message: 'Incorrect twitter account'});
    }));

    passport.use(new FacebookStrategy({
        clientID: FACEBOOK_APP_ID,
        clientSecret: FACEBOOK_APP_SECRET,
        callbackURL: FACEBOOK_CALLBACK_URL
    },
    (accessToken, refreshToken, profile, done) => {
        var username = profile._json.name;
        if (username) return done(null, {username: username});
        return done(null, false, {message: 'Incorrect facebook account'});
    }));

    passport.serializeUser((user, done) => done(null, user));
    passport.deserializeUser((user, done) => done(null, user));

    app.use((req, res, next) => {
        if (req.user) {
            res.locals.loggedUser = req.user;
            return next();
        }
        res.locals.loggedUser = undefined;

        if (req.path.startsWith('/login')) return next();
        if (req.path.startsWith('/twitter')) return next();
        if (req.path.startsWith('/facebook')) return next();
        if (req.path.startsWith('/api/ping')) return next();
        if (req.path.startsWith('/home')) return next();
        if (req.path.startsWith('/css')) return next();
        if (req.path.startsWith('/learn.json')) return next();
        return res.redirect('/login');
    });

    app.get('/login', (req, res) => {
        if (!req.user) {
            const error = req.flash('error');
            var data = {
                title: 'Login page',
                message: 'Please, log in into the TODO node app',
                errorMessage: (error.length > 0 ? error[0] : null)
            };
            res.render('login', data);
        } else {
            res.redirect('home');
        }
    });

    app.post('/login',
        passport.authenticate('local', {
            successRedirect: '/home',
            failureRedirect: '/login',
            failureFlash: true
        }));

    app.get('/twitter', passport.authenticate('twitter'));
    app.get('/twitter/callback',
        passport.authenticate('twitter', {
            successRedirect: '/home',
            failureRedirect: '/login',
            failureFlash: true
        }));

    app.get('/facebook', passport.authenticate('facebook'));
    app.get('/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect: '/home',
            failureRedirect: '/login',
            failureFlash: true
        }));

    app.get('/logout', (req, res) => {
        if (req.user) {
            req.logout();
            res.redirect('/login');
        }
    });

    // NOTE: you can protect resources using isLoggedIn middleware. Take a look at profile route...
    function isLoggedIn (req, res, next) {
        if (req.isAuthenticated()) return next();
        res.redirect('/login');
    }

    app.get('/profile', isLoggedIn, (req, res) => {
        res.render('profile', {
            user: req.user
        });
    });
}
