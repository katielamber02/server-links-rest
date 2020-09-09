const AWS = require('aws-sdk');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
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
  const params = {
    Source: process.env.EMAIL_FROM,
    Destination: {
      ToAddresses: [email],
    },
    ReplyToAddresses: [process.env.EMAIL_TO],
    Message: {
      /* required */
      Body: {
        /* required */
        Html: {
          Charset: 'UTF-8',
          Data: `<html><h1>Hello, ${name}
                Verify your email with the following link:
                
                </h1 style="color:blue">
                <p>${process.env.CLIENT_URL}/auth/activate/${token}</p></html>`,
        },
        Text: {
          Charset: 'UTF-8',
          Data: 'TEXT_FORMAT_BODY',
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: 'Complete registration',
      },
    },
  };
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
};
