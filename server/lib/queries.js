const settings = require("../../settings"); // settings.json

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

module.exports = {
  // insert returning id of just inserted
  insertUser: (data, done) => {
    knex('users')
    .insert(data, 'id')
    .then(done)
    .catch((err) => {
      console.log(err);
    });
  },

  insertPoll: (data, done) => {
    knex('polls')
    .insert(data, ['id', 'user_key', 'admin_key'])
    .then(done)
    .catch((err) => {
      console.log(err);
    });
  },

  insertChoice: (data, done) => {
    knex('choices')
    .insert(data)
    .then(done)
    .catch((err) => {
      console.log(err);
    });
  },

  insertAnswer: (data, done) => {
    knex('anwers')
    .insert({
      choice_id: data.choice_id,
      points: data.points
    })
    .then(done)
    .catch((err) => {
      console.log(err);
    });
  },

  findPoll: (key, done) => {
    knex('polls')
    .select()
    .where('user_key', key)
    .orWhere('admin_key', key)
    .then(done)
    .catch((err) => {
      console.log(err);
    });
  },

  findChoices: (key, done) => {
    knex('choices')
    .select()
    .where('poll_id', key)
    .then(done)
    .catch((err) => {
      console.log(err);
    });
  }

};
