'use strict';

const pollsRoutes   = require('express').Router();
const queries = require('../lib/queries');
const md5 = require('md5');
const email = require('../lib/email');

function createKey(id){
  let admin = md5(id);
  let user = md5(id * 5);
  return [user, admin];
}

module.exports = (queries) => {
  pollsRoutes.post('/', (req, res) => {
    // console.log('Body of request: ', req.body);
    queries.insertUser({email: req.body.email}, (id) => {
      let keys = createKey(id.join(''));
      queries.insertPoll({
        user_id: id[0],
        question: req.body.question,
        end_date: req.body.end_date,
        user_key: keys[0],
        admin_key: keys[1]
      }, (keys) => {
        let poll_id = keys[0].id;
        let data = {
          user: keys[0].user_key,
          admin: keys[0].admin_key
        };
        for (let choice of req.body.choices) {
          choice.poll_id = poll_id;
        }
        queries.insertChoice(req.body.choices, () => {
          let recipient = 'zuzana.toldyova@gmail.com';
          email.sendMailCreated(recipient, data);
          console.log('response from post POLLS', data);
          res.status(201).json(data);
        });
      });
    });
  });

  pollsRoutes.get('/:id', (req, res) => {
    // TODO: check if id exists
    // TODO: if poll closed send polls results
    queries.findPollUser(req.params.id, (result) => {
      let pollId = result[0].id;
      let question = result[0].question;
      queries.findChoices(pollId, (choices) => {
        let data = {
          question,
          choices
        };
        console.log(data);
        res.status(201).json(data);
      });
    });
  });

  pollsRoutes.post('/:id', (req, res) => {
    // TODO: check if id exists
    console.log(req.body.answers);
    queries.insertAnswer(req.body.answers, () => {
      // TODO: sned an email to the admin
      res.status(201).send();
    });
  });

  return pollsRoutes;
};
