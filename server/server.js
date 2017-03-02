"use strict";

// Basic express setup:
const PORT          = process.env.PORT || 8080;
const express       = require("express");
const bodyParser    = require("body-parser");
const app           = express();

const sassMiddleware = require('node-sass-middleware');
const path = require('path');
app.use(sassMiddleware({
    /* Options */
    src: path.join(__dirname, '../public/'),
    dest: path.join(__dirname, '../public/'),
    debug: true,
    outputStyle: 'compressed',
}));


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("../public"));

const settings = require("../settings"); // settings.json

var knex = require('knex')({
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


 app.listen(PORT, () => {
    console.log("Example app listening on port " + PORT);
  });