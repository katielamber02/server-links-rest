const Category = require('../models/category');
const Link = require('../models/link');
const slugify = require('slugify');
require('dotenv').config();

exports.createLink = (req, res) => {
  const { title, url, categories, type, medium } = req.body;
  console.table({ title, url, categories, type, medium });
  const slug = url;
  // let link = new Link({ title, url, categories, type, medium, slug });
  // link.postedBy = req.user._id;
  // console.log(link);

  let arrayOfCategiries = categories && categories.split(','); // for postman check only
  link.categories = arrayOfCategiries;
  link.save((err, data) => {
    if (err) {
      return res.status(400).json({
        error: 'Link already exists',
      });
    }
    return res.json(data);
  });
};
exports.showAllLinks = (req, res) => {
  Link.find({}).exec((err, data) => {
    if (err) {
      return res.status(400).json({
        error: 'Error happend when displaying the list of links',
      });
    }
    return res.json(data);
  });
};
exports.showSingleLink = (req, res) => {};
exports.updateLink = (req, res) => {};
exports.removeLink = (req, res) => {};

exports.clickCount = (req, res) => {
  const { linkId } = req.body;
  console.log(req.body);
  console.log('linkId:', linkId);
  Link.findByIdAndUpdate(
    linkId,
    { $inc: { clicks: 1 } },
    { upsert: true, new: true }
  ).exec((err, result) => {
    if (err) {
      res.status(400).json({
        erorr: 'Error happend when displaying clicks',
      });
    }
    res.json(result);
  });
};
