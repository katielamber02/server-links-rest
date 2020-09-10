const Category = require('../models/category');
const slugify = require('slugify');
require('dotenv').config();

exports.createCategory = (req, res) => {
  const { name, content } = req.body;
  const slug = slugify(name);
  const image = {
    url: `https://via.placeholder.com/150.png?text=${process.env.CLIENT_URL}`,
    key: '123',
  };

  const category = new Category({ name, slug, image });
  //   console.log('req.user:', req.user); // req.user is available due to requireAuth controller which uses const token = jwt.sign({ _id: user._id }...
  category.postedBy = req.user._id;

  category.save((err, data) => {
    if (err) {
      console.log('CATEGORY CREATE ERR', err);
      return res.status(400).json({
        error: 'Category create failed',
      });
    }
    res.json(data);
  });
};
exports.showAllCategories = (req, res) => {};
exports.showSingleCategory = (req, res) => {};
exports.removeCategory = (req, res) => {};
