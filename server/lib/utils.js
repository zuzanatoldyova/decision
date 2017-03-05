const queries = require('./queries');

module.exports = {
  checkId: (req, res, next) => {
    queries.findPollId(req.params.id, (result) => {
      if(result.length){
        next();
      } else {
        res.status(404).send('Page not found');
      }
    });
  }
};