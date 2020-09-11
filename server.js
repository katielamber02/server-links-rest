const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const authRouter = require('./routes/auth');
const categoryRouter = require('./routes/category');
const linkRouter = require('./routes/link');
require('dotenv').config();

const app = express();

mongoose
  .connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => console.log('connected to DB'))
  .catch((err) => console.error(err));

app.use(morgan('dev'));
//app.use(bodyParser.json()
app.use(bodyParser.json({ limit: '5mb', type: 'application/json' }));
app.use(cors({ origin: process.env.CLIENT_URL }));

app.use('/api', authRouter);
app.use('/api', categoryRouter);
app.use('/api', linkRouter);
const port = process.env.PORT;
app.listen(port, () => console.log(`Server is listening on port ${port}`));
