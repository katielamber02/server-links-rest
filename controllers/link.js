const Category = require('../models/category');
const slugify = require('slugify');
require('dotenv').config();

exports.createLink = (req, res) => {
  const { title, url, categories, type, medium } = req.body;
  console.table({ title, url, categories, type, medium });
  const slug = url;
  let link = new Link({ title, url, categories, type, medium, slug });
  link.postedBy = req.user._id;
};
exports.showAllLinks = (req, res) => {};
exports.showSingleLink = (req, res) => {};
exports.updateLink = (req, res) => {};
exports.removeLink = (req, res) => {};
