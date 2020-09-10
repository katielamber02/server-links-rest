const AWS = require('aws-sdk');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const { emailParams } = require('../helpers/emailParams');
require('dotenv').config();

console.log(
  'REGION',
  process.env.AWS_ACCESS_KEY_ID,
  process.env.AWS_REGION,
  process.env.CLIENT_URL
);

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const ses = new AWS.SES({ apiVersion: '2010-12-01' });

exports.register = (req, res) => {
  // https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/ses-examples-sending-email.html
  const { name, email, password } = req.body;

  User.findOne({ email }).exec((err, user) => {
    if (user) {
      return res.status(400).json({
        error: 'Email has aleady been taken',
      });
    }
    const token = jwt.sign(
      { name, email, password },
      process.env.JWT_ACCOUNT_ACTIVATION,
      {
        expiresIn: '10m',
      }
    );
    console.log('TOKEN1:', token);

    const params = emailParams(email, token, name);
    const sendRegistrationEmail = ses.sendEmail(params).promise();
    sendRegistrationEmail
      .then((data) => {
        console.log('data submitted to SES:', data);
        res.json({
          message: `Email has been sent to ${email}`,
          // {message: "Email has been sent to katielamber02@gmail.com"}
        });
      })
      .catch((error) => {
        console.log('error when data submitted to SES:', error);
        res.json({
          message: `Email could not be verified`,
        });
        // {error: "Email could not be verified"}
        //  message: `Email could not be verified`
      });
  });
};
