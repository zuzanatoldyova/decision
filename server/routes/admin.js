'use strict';

const adminRoutes   = require('express').Router();
const queries = require('../lib/queries');
const utils = require('../lib/utils');

module.exports = (queries) => {
  adminRoutes.get('/:id', utils.checkId, (req, res) => {
    queries.findPollAdmin(req.params.id, (result) => {
      let open = result[0].open;
      let pollId = result[0].id;
      let question = result[0].question;
      queries.findChoicesResults(pollId, (results) => {
        let data = {
          open,
          question,
          results
        };
        queries.findNamesPreferences(pollId, (results) => {
          data.preferences = results;
          res.render("../../views/results", data);
        });

      });
    });
  });

  adminRoutes.put('/:id', (req, res) => {
    queries.findPollAdmin(req.params.id, (poll) => {
      queries.updatePollClose(poll[0].id, req.body, (result) => {
        res.status(201).send('updated');
      });
    });
  });


  return adminRoutes;
};