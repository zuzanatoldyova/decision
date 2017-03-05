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
    .insert(data, 'id')
    .then(done)
    .catch((err) => {
      console.log(err);
    });
  },

  insertAnswer: (data, done) => {
    knex('answers')
    .insert(data)
    .then(done)
    .catch((err) => {
      console.log(err);
    });
  },

  findPollUser: (key, done) => {
    knex('users')
    .leftJoin('polls', function() {
      this.on('polls.user_id', '=', 'users.id');
    })
    .select()
    .where('user_key', key)
    .then(done)
    .catch((err) => {
      console.log(err);
    });
  },

  findPollAdmin: (key, done) => {
    knex('polls')
    // .leftJoin('users', function() {
    //   this.on('polls.user_id', '=', 'users.id');
    // })
    .select()
    .where('admin_key', key)
    .then(done)
    .catch((err) => {
      console.log(err);
    });
  },

  findChoices: (pollId, done) => {
    knex('choices')
    .select()
    .where('poll_id', pollId)
    .then(done)
    .catch((err) => {
      console.log(err);
    });
  },

  findChoice: (choiceId, done) => {
    knex('choices')
    .select()
    .where('id', choice_id)
    .then(done)
    .catch((err) => {
      console.log(err);
    });
  },

  findChoicesResults: (pollId, done) => {
    knex('choices')
    .select('id')
    .where('poll_id', pollId)
    .then(function (data) {
      let choicesIds = data.map(x => {
        return x.id;
      });
      knex('choices')
      .leftJoin('answers', function() {
        this.on('answers.choice_id', '=', 'choices.id');
      })
      .select('choices.id', 'choice_title', 'description')
      .sum('points')
      .whereIn('choices.id', choicesIds)
      .groupBy('choices.id', 'choice_title', 'description')
      .then(done);
    });
  },

  updatePollClose: (pollId, data, done) => {
    knex('polls')
    .where('id', pollId)
    .update(data)
    .then(done)
    .catch((err) => {
      console.log(err);
    });
  }
};
