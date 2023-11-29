const express = require('express');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const bodyParser = require('body-parser');
const path = require('path');
const dotenv = require('dotenv');
const sequelize = require('./config/connection'); // Your Sequelize connection

// Load environment variables from .env file
dotenv.config();

const app = express();

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Static folder
app.use(express.static(path.join(__dirname, 'public')));

// Session middleware using Sequelize for session store
const sessionStore = new SequelizeStore({
  db: sequelize,
});

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'secret',
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
  })
);

// View engine setup (assuming you're using Handlebars)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs'); // Assuming you're using hbs files for views

// Your routes setup (these are example routes)
const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const postRouter = require('./routes/post');
const userRouter = require('./routes/user');

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/posts', postRouter);
app.use('/users', userRouter);

// Start the server
const PORT = process.env.PORT || 3000;
sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });
});