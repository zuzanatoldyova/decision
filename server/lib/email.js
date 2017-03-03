const Mailgun       = require('mailgun').Mailgun;
const mailgun       = new Mailgun('key-638485475a9c391d8569d60a7f3ea584');
const fromWho      = 'dteam@email.com';

module.exports = {
  sendMailCreated: (recipient, data) => {
    console.log(recipient);
    console.log(data);
    mailgun.sendText(fromWho, [`Recipient 1 <${recipient}>`],
      'decision maker new poll',
      `You successfully created a new poll, here are your links :\n admin ${data.admin}\n user ${data.user}`,
      'noreply@example.com', {},
      function(err) {
        if (err) {
          console.log('Oh noes: ' + err);
        } else {
          console.log('Success');
        }
      });
  }
};

