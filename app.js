// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require('dotenv/config');

// ℹ️ Connects to the database
require('./db');

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require('express');

//handles express-session and connect- mongo
const session = require('express-session');
const MongoStore = require('connect-mongo')

// Handles the handlebars
// https://www.npmjs.com/package/hbs
const hbs = require('hbs');

const app = express();

app.use(
    session({
        name: 'someApp',
        secret: process.env.SESSION_SECRET,
        resave: true,
        saveUninitialized: false,
        cookie: {
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            secure: process.env.NODE_ENV === 'production',
            httpOnly: true,
            maxAge: 2592000000 // 30 days in milliseconds
        },
        store: MongoStore.create({
            mongoUrl: process.env.MONGO_URL || 'mongodb://localhost/basic-auth'
        })
    })
)



// ℹ️ This function is getting exported from the config folder. It runs most middlewares
require('./config')(app);

// default value for title local
const projectName = 'lab-express-basic-auth';
const capitalized = string => string[0].toUpperCase() + string.slice(1).toLowerCase();

app.locals.title = `${capitalized(projectName)}- Generated with Ironlauncher`;

// 👇 Start handling routes here

const index = require('./routes/index');
const userRouter = require('./routes/auth');
const mainRouter = require('./routes/main');
const privateRouter = require('./routes/private');



app.use('/', index);
app.use('/auth', userRouter)
app.use('/main', mainRouter)
app.use('/private', privateRouter);

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require('./error-handling')(app);

module.exports = app;

