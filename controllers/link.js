const Category = require('../models/category');
const Link = require('../models/link');
const slugify = require('slugify');
require('dotenv').config();

exports.createLink = (req, res) => {
  const { title, url, categories, type, medium } = req.body;
  console.table({ title, url, categories, type, medium });
  // const slug = url;
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
// exports.showAllLinks = (req, res) => {
//   Link.find({}).exec((err, data) => {
//     if (err) {
//       return res.status(400).json({
//         error: 'Error happend when displaying the list of links',
//       });
//     }
//     return res.json(data);
//   });
// };
exports.showAllLinksToAdmin = (req, res) => {
  let limit = req.body.limit ? parseInt(limit) : 10;
  let skip = req.body.skip ? parseInt(skip) : 0;
  Link.find({})
    .populate('postedBy', 'name')
    .populate('categories', 'name slug')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .exec((err, data) => {
      if (err) {
        return res.status(400).json({
          error: 'Error happend when displaying the list of links',
        });
      }
      return res.json(data);
    });
};
exports.showSingleLink = (req, res) => {};
exports.updateLink = (req, res) => {
  const { id } = req.params;
  const { title, url, categories, type, medium } = req.body;
  const linkToUpdate = { title, url, categories, type, medium };
  Link.findOneAndUpdate({ _id: id }, linkToUpdate, { new: true }).exec(
    (err, updatedLink) => {
      if (err) {
        return res.status(400).json({
          error: 'Error happend when updating the list of links',
        });
      }
      res.json(updatedLink);
    }
  );
};
exports.removeLink = (req, res) => {
  const { id } = req.params;
  Link.findOneAndRemove({ _id: id }).exec((err, result) => {
    if (err) {
      return res.status(400).json({
        error: 'Error happend when removing the list of links',
      });
    }
    res.json({
      message: 'Link has been removed successfully',
    });
  });
};

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
