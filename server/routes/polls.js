'use strict';

const pollsRoutes   = require('express').Router();
const queries = require('../lib/queries');
const md5 = require('md5');
const emailUtil = require('../lib/email');
const linkPrependUser = 'http://localhost:8080/polls/';
const linkPrependAdmin = 'http://localhost:8080/admin/polls/';
const twilioUtil = require('../lib/twilio');

function createKey(id){
  let admin = md5(id);
  let user = md5(id * 5);
  return [user, admin];
}

module.exports = (queries) => {
  pollsRoutes.post('/', (req, res) => {
    console.log(req.body.email_invite);
    // console.log('Body of request: ', req.body);
    // inserting user
    queries.insertUser({email: req.body.email}, (id) => {
      let keys = createKey(id.join(''));
      // inserting poll data
      queries.insertPoll({
        user_id: id[0],
        question: req.body.question,
        end_date: req.body.end_date,
        user_key: keys[0],
        admin_key: keys[1]
      }, (result) => {
        let poll_id = result[0].id;
        // retieving links for user and admin
        let data = {
          user: linkPrependUser + result[0].user_key,
          admin: linkPrependAdmin + result[0].admin_key
        };
        // adding poll ID to each choice
        for (let choice of req.body.choices) {
          choice.poll_id = poll_id;
        }
        queries.insertChoice(req.body.choices, () => {
          // TODO change to actual user
          let recipient = 'zuzana.toldyova@gmail.com';
          emailUtil.sendMailCreated(recipient, data);
          if (req.body.email_invite) {
            emailUtil.sendMailInvites(req.body.email, req.body.email_invite, data.user);
          }
          // Sending sms invites to friends
          if (req.body.sms_invite) {
            twilioUtil.sendSmsInvites(req.body.email, data.user, req.body.sms_invite);
          }
          console.log('response from post POLLS', data);
          res.status(201).json(data);
        });
      });
    });
  });

  pollsRoutes.get('/:id', (req, res) => {
    // TODO: check if id exists
    // TODO: if poll closed send polls results ----> redirect
    queries.findPollUser(req.params.id, (result) => {
      let pollId = result[0].id;
      let question = result[0].question;
      let email = "test@hotmail.com";
      queries.findChoices(pollId, (choices) => {
        let data = {
          id : pollId,
          question,
          email,
          choices
        };
        console.log(data);
        res.status(201).render('../../public/views/rankpoll', data);
      });
    });
  });

  pollsRoutes.post('/:id', (req, res) => {
    // TODO: check if id exists
    queries.findPollUser(req.params.id, (result) => {
      console.log(result);
      let data = {
        user: linkPrependUser + result[0].user_key,
        admin: linkPrependAdmin + result[0].admin_key
      };
      let email = result[0].email; // prepared for recipient
      // console.log(req.body.answers);
      queries.insertAnswer(req.body.answers, () => {
      // TODO: change to actual user
        let recipient = 'zuzana.toldyova@gmail.com';
        emailUtil.sendMailVoted(recipient, data);
        res.status(201).send();
      });

    });

  });

  return pollsRoutes;
};
