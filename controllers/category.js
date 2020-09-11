const Category = require('../models/category');
const slugify = require('slugify');
require('dotenv').config();
const formidable = require('formidable');
const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
require('dotenv').config();

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

// Version 1
// exports.createCategory = (req, res) => {
//   const { name, content } = req.body;
//   const slug = slugify(name);
//   const image = {
//     url: `https://via.placeholder.com/150.png?text=${process.env.CLIENT_URL}`,
//     key: '123',
//   };

//   const category = new Category({ name, slug, image });
//   //   console.log('req.user:', req.user); // req.user is available due to requireAuth controller which uses const token = jwt.sign({ _id: user._id }...
//   category.postedBy = req.user._id;

//   category.save((err, data) => {
//     if (err) {
//       console.log('CATEGORY CREATE ERR', err);
//       return res.status(400).json({
//         error: 'Category create failed please use unique name or description',
//       });
//     }
//     res.json(data);
//   });
// };

exports.createCategory = (req, res) => {
  let form = new formidable.IncomingForm();
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: 'Image could not upload',
      });
    }
    console.table({ err, fields, files });
    const { name, content } = fields;
    const { image } = files;

    const slug = slugify(name);
    let category = new Category({ name, content, slug });

    if (image.size > 2000000) {
      return res.status(400).json({
        error: 'Image should be less than 2mb',
      });
    }

    const params = {
      Bucket: process.env.MY_PUBLIC_TEMP_BUCKET_NAME, // TODO:change policy
      Key: `category/${uuidv4()}`,
      Body: fs.readFileSync(image.path),
      ACL: 'public-read',
      ContentType: `image/jpg`,
    };

    s3.upload(params, (err, data) => {
      if (err) {
        console.log(err);
        res.status(400).json({ error: 'Upload to s3 failed' });
      }
      console.log('AWS UPLOAD RES DATA', data);
      category.image.url = data.Location;
      category.image.key = data.Key;

      category.save((err, success) => {
        if (err) {
          console.log(err);
          res.status(400).json({ error: 'Duplicate category' });
        }
        return res.json(success);
      });
    });
  });
};
exports.showAllCategories = (req, res) => {};
exports.showSingleCategory = (req, res) => {};
exports.removeCategory = (req, res) => {};
