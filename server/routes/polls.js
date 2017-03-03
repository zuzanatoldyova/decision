'use strict';
const bodyParser    = require("body-parser");
const pollsRoutes   = require('express').Router();
const bcrypt = require('bcryptjs');
const queries = require('../lib/queries');
const md5 = require('md5');


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
          // TODO send email with links to the creator
          console.log('response from post POLLS', data);
          res.status(201).json(data);
        });
      });
    });
  });

  pollsRoutes.get('/:id', (req, res) => {
    queries.findPollUser(req.params.id, (result) => {
      console.log(result);
      let pollId = result[0].id;
      let question = result[0].question;
      // let email = result[0].email;
      // let choice_title = result[0].choices.choice_title;
      // let data_id = result[0].choices.id;
      // let description = result[0].choices.description;
      queries.findChoices(pollId, (choices) => {
        let data = {"question":"sport","choices":[{"id":124,"poll_id":56,"choice_title":"tennis","description":""},{"id":125,"poll_id":56,"choice_title":"soccer","description":""}]}
        // {
        //   email,
        //   question,
        //   choice_title,
        //   data_id, 
        //   choices
        // };
        console.log(data);
        res.render('../../public/views/rankpoll', data);
        // res.status(201).json(data);
        
      });
    });
  });

  pollsRoutes.put('/:id', (req, res) => {
    console.log(req.body.answers);
    queries.insertAnswer(req.body.answers, () => {
      // TODO: sned an email to the admin
      res.status(201).send();
    });
  });

  pollsRoutes.get('/:id/results', (req, res) => {
    console.log('Get results id:', req.params.id);
    queries.findPoll(req.params.id, (result) => {
      let pollId = result[0].id;
      let question = result[0].question;
      let email = result[0].email;
      queries.findChoicesResults(pollId, (results) => {
        let data = {
          email,
          question,
          results
        };
        res.status(201).json(data);

      });
    });
  });

  return pollsRoutes;
};
