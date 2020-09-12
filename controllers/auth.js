const AWS = require('aws-sdk');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const { emailParams } = require('../helpers/emailParams');
const { resetPasswordEmailParams } = require('../helpers/resetPassword');
const expressJwt = require('express-jwt');
const _ = require('lodash');
const Link = require('../models/link');
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

      const newUser = new User({ username, name, email, password }); // to use req.user
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

exports.requireAuth = expressJwt({
  secret: process.env.JWT_SECRET,
  algorithms: ['HS256'],
});

exports.authMiddleware = (req, res, next) => {
  const authUserId = req.user._id;
  User.findOne({ _id: authUserId }).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: 'User not found',
      });
    }
    req.profile = user;
    next();
  });
};

exports.adminMiddleware = (req, res, next) => {
  const adminUserId = req.user._id;
  User.findOne({ _id: adminUserId }).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: 'User not found',
      });
    }
    if (user.role !== 'admin') {
      return res.status(400).json({
        error: 'Admin resourse. No access',
      });
    }

    req.profile = user;
    next();
  });
};

exports.showProfile = (req, res) => {
  // req.profile.hashed_password = undefined;
  // req.profile.salt = undefined;
  User.findOne({ _id: req.user._id }).exec((err, user) => {
    if (err) {
      return res.status(400).json({
        error: `User not found`,
      });
    }
    Link.find({ postedBy: user })
      .populate('categories', 'name slug')
      .populate('postedBy', 'name')
      .sort({ createAt: -1 })
      .exec((err, links) => {
        if (err) {
          return res.status(400).json({
            error: `Could not find links`,
          });
        }
        res.json({ user, links });
      });
  });
  // return res.json(req.profile);
};

exports.forgotPassword = (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email }).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: `User with this email doens't exist`,
      });
    }
    const token = jwt.sign(
      { name: user.name },
      process.env.JWT_RESET_PASSWORD,
      { expiresIn: '10m' }
    );
    const params = resetPasswordEmailParams(email, token);

    return user.updateOne({ resetPasswordLink: token }, (err, success) => {
      if (err) {
        return res.status(400).json({
          error: `Password rest failed, try later`,
        });
      }
      const sendEmail = ses.sendEmail(params).promise();
      sendEmail
        .then((data) => {
          console.log('ses reset password success data: ', data);
          return res.json({
            message: `Email has been sent to ${email}. Please, click on the link in order to rests password`,
          });
        })
        .catch((err) => console.log('ses reset password success error: ', err));
    });
  });
};

exports.resetPassword = (req, res) => {
  const { resetPasswordLink, newPassword } = req.body;
  if (resetPasswordLink) {
    jwt.verify(
      resetPasswordLink,
      process.env.JWT_RESET_PASSWORD,
      (err, success) => {
        if (err) {
          return res.status(400).json({
            error: 'Link has expired. Try again',
          });
        }
        User.findOne({ resetPasswordLink }).exec((err, user) => {
          if (err || !user) {
            return res.status(400).json({
              error: 'Invalid token. Try again',
            });
          }
          const updatedFields = {
            password: newPassword,
            resetPasswirdLink: '',
          };
          user = _.extend(user, updatedFields);
          user.save((err, result) => {
            if (err) {
              return res.status(400).json({
                error: 'Password reset failed',
              });
            }
            res.json({
              message: `Your password has been changed successfully. You can login with the new password.`,
            });
          });
        });
      }
    );
  }
};

//git rev-parse HEAD
// 64f3b319d3a1dbf85331b3b42135a52950e7d693
