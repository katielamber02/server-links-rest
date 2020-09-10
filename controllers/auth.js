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

exports.emailConfirmationOnRegister = (req, res) => {
  const { token } = req.body;
  // console.log('TOKEN2:', token);
  jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, function (
    error,
    decodedInfo
  ) {
    if (error) {
      return res.status(401).json({
        error: 'Expired link. Try again',
      });
    }

    const { name, email, password } = jwt.decode(token);

    const username = (
      Date.now().toString(36) + Math.random().toString(36).substr(2, 5)
    ).toUpperCase();

    User.findOne({ email }).exec((error, user) => {
      if (user) {
        return res.status(401).json({
          error: 'Email has already been taken',
        });
      }

      const newUser = new User({ username, name, email, password });
      newUser.save((error, result) => {
        if (error) {
          return res.status(401).json({
            error: 'Error saving user in database. Try later',
          });
        }
        return res.json({
          message: 'Registration success. Please login.',
        });
      });
    });
  });
};
exports.login = (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email }).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: 'User with that email does not exist. Please register.',
      });
    }
    // authenticate
    if (!user.authenticate(password)) {
      return res.status(400).json({
        error: 'Email or password do not match',
      });
    }
    // generate token and send to client
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '3d',
    });
    const { _id, name, email, role } = user;

    return res.json({
      token,
      user: { _id, name, email, role },
    });
  });
};
