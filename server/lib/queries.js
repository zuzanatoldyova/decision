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
    .insert({
      email: data.email
    }, 'id')
    .then(done)
    .catch((err) => {
      console.log(err);
    });
  },

  insertPoll: (data, done) => {
    knex('polls')
    .insert({
      user_id: data.user_id,
      question: data.question,
      end_date: data.end_date,
      user_key: data.user_key,
      admin_key: data.admin_key
      }, ['id', 'user_key', 'admin_key'])
    .then(done)
    .catch((err) => {
      console.log(err);
    });
  },

  insertChoice: (data, done) => {
    knex('choices')
    .insert(data
    // {
    //   poll_id: data.poll_id,
    //   choice_title: data.choice_title,
    //   description: data.description
    // }
    )
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
  }

};
