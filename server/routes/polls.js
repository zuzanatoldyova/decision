'use strict';

const pollsRoutes   = require('express').Router();
const queries = require('../lib/queries');
const md5 = require('md5');
const emailUtil = require('../lib/email');
const linkPrependUser = 'http://localhost:8080/polls/';
const linkPrependAdmin = 'http://localhost:8080/admin/polls/';
const twilioUtil = require('../lib/twilio');
const utils = require('../lib/utils');

function createKey(id){
  let admin = md5(id);
  let user = md5(id * 5);
  return [user, admin];
}

module.exports = (queries) => {
  pollsRoutes.post('/', (req, res) => {
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
          let recipient = req.body.email;
          emailUtil.sendMailCreated(recipient, data);
          if (req.body.email_invite) {
            emailUtil.sendMailInvites(req.body.email, req.body.email_invite, data.user);
          }
          // Sending sms invites to friends
          if (req.body.sms_invite) {
            twilioUtil.sendSmsInvites(req.body.email, data.user, req.body.sms_invite);
          }
          res.status(201).json(data);
        });
      });
    });
  });

  pollsRoutes.get('/:id', utils.checkId, (req, res) => {
    queries.findPollUser(req.params.id, (result) => {
      let pollId = result[0].id;
      let question = result[0].question;
      let email = result[0].email;
      let key = req.params.id;
      if (!result[0].open) {
        queries.findChoicesResults(pollId, (results) => {
          let data = {
            question,
            results
          };
          res.render("../../views/resultsUser", data);
        });
      } else {
        queries.findChoices(pollId, (choices) => {
          let data = {
            id: key,
            question,
            choices,
            email
          };
          res.status(201).render('../../views/rankpoll', data);
        });
      }
    });
  });

  pollsRoutes.post('/:id', (req, res) => {
    queries.findPollUser(req.params.id, (result) => {
      let data = {
        user: linkPrependUser + result[0].user_key,
        admin: linkPrependAdmin + result[0].admin_key
      };
      let recipient = result[0].email;
      queries.insertAnswer(req.body.answers, () => {
        emailUtil.sendMailVoted(recipient, data);
        res.status(201).send();
      });

    });

  });

  return pollsRoutes;
};