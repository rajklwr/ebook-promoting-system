const { Resend } = require('resend');
const resend = new Resend('re_AN9LVZND_Gw5j7nGwfoKmWfRBoC3Zjwog');

exports.sendEmail = async ({ to, subject, html }) => {
  const msg = {
    from: 'paul@elixzorconsulting.com', // Ensure this email is verified with Resend
    to,
    subject,
    html: html, 
  };
    resend.emails
    .send(msg)
    .then((data) => {
      console.log('Email sent To:', to)
    })
    .catch((error) => {
      console.error('Error:', error)
      throw new Error('Email sending failed');
    });
};


