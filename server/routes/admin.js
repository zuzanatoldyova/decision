'use strict';

const adminRoutes   = require('express').Router();
const queries = require('../lib/queries');

module.exports = (queries) => {
  adminRoutes.get('/:id/results', (req, res) => {
    console.log('Get results id:', req.params.id);
    queries.findPoll(req.params.id, (result) => {
      let open = result[0].open;
      let pollId = result[0].id;
      let question = result[0].question;
      queries.findChoicesResults(pollId, (results) => {
        let data = {
          open,
          question,
          results
        };
        res.status(201).json(data);

      });
    });
  });

  adminRoutes.put('/:id', (req, res) => {
    console.log('Request for update ', req.body);
    console.log('Get update poll adminkey: ', req.params.id);
    queries.findPollAdmin(req.params.id, (poll) => {
      console.log(poll[0].id);
      queries.updatePollClose(poll[0].id, req.body, (result) => {
        console.log('updated poll: ', result);
        res.status(201).send('updated');
      });
    });

  });


  return adminRoutes;
};