"use strict";

// Basic express setup:
require('dotenv').config();
const twilio        = require('twilio');
const accountSid    = process.env.TWILIO_ACCOUNT_SID;
const authToken     = process.env.TWILIO_AUTH_TOKEN;
const twilioNumber  = process.env.TWILIO_NUMBER;
const client        = new twilio.RestClient(accountSid, authToken);
const PORT          = process.env.PORT || 8080;
const express       = require("express");
const bodyParser    = require("body-parser");
const app           = express();
const API_KEY       = process.env.API_KEY;

app.set("view engine", "ejs");

const sassMiddleware = require('node-sass-middleware');
const path = require('path');
app.use(sassMiddleware({
  /* Options */
  src: path.join(__dirname, '../public/'),
  dest: path.join(__dirname, '../public/'),
  debug: true,
  outputStyle: 'compressed'
}));


const queries = require('./lib/queries.js');
const pollsRoutes = require('./routes/polls.js');
const adminRoutes = require('./routes/admin.js');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


const settings = require("../settings");

const knex = require('knex')({
  client: 'pg',
  connection: {
    user     : settings.user,
    password : settings.password,
    database : settings.database,
    host     : settings.hostname,
    port     : settings.port,
    ssl      : settings.ssl
  }
});


app.use(express.static("../public"));


app.use('/polls', pollsRoutes(queries));
app.use('/admin/polls', adminRoutes(queries));



app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});