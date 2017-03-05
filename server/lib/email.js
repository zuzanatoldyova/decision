const Mailgun       = require('mailgun').Mailgun;
const API_KEY       = process.env.API_KEY;
const mailgun       = new Mailgun(API_KEY);
const fromWho      = 'dteam@email.com';


function sendMailInvite(user, recipient, link) {
  mailgun.sendText(fromWho, [`Recipient 1 <${recipient}>`],
    'decision maker poll invite',
    `${user} invites you to vote on the poll, help out here:\n user: ${link}`,
    'noreply@example.com', {},
    function(err) {
      if (err) {
        console.log('Oh noes: ' + err);
      } else {
        console.log('Success');
      }
    });
}

module.exports = {
  sendMailCreated: (recipient, data) => {
    mailgun.sendText(fromWho, [`Recipient 1 <${recipient}>`],
      'decision maker new poll',
      `You successfully created a new poll, here are your links :\n admin: ${data.admin}\n user: ${data.user}`,
      'noreply@example.com', {},
      function(err) {
        if (err) {
          console.log('Oh noes: ' + err);
        } else {
          console.log('Success');
        }
      });
  },

  sendMailVoted: (recipient, data) => {
    mailgun.sendText(fromWho, [`Recipient 1 <${recipient}>`],
      'decision maker poll update',
      `Your poll has a new vote, check results on you admin link :\n admin: ${data.admin}\n user: ${data.user}`,
      'noreply@example.com', {},
      function(err) {
        if (err) {
          console.log('Oh noes: ' + err);
        } else {
          console.log('Success');
        }
      });
  },

  sendMailInvites: (user, recipients, link) => {
    recipients.forEach(recipient => {
      sendMailInvite(user, recipient, link);
    });
  }
};

