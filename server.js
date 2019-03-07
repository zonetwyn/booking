const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const cors = require('cors');
const path = require('path');

require('./config/passport');

const API_PREFIX = require('./config/constants').API_PREFIX;

const app = express();

const keys = require('./config/keys');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const uploadRoutes = require('./routes/upload');
const smsRoutes = require('./routes/sms');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors());

app.use(express.static(path.join(__dirname, 'public')));

// initialize passport
app.use(passport.initialize());
app.use(passport.session());

// connect to mongodb
mongoose
    .connect(keys.mongo.mongoURI, {useNewUrlParser: true})
    .then(() => console.log('MongoDB connected.'))
    .catch(err => console.log(err));

app.use(API_PREFIX + 'auth', authRoutes);
app.use(API_PREFIX + 'users', passport.authenticate('jwt', { session: false }), userRoutes);
app.use(API_PREFIX + 'files', uploadRoutes);  
app.use(API_PREFIX + 'sms', smsRoutes);       

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Sever started on port ${port}`);
})