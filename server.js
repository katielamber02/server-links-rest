const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

mongoose
  .connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => console.log("connected to DB"))
  .catch((err) => console.error(err));

app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(cors({ origin: process.env.CLIENT_URL }));

app.get("/", (req, res) => {
  res.json({
    data: "MAIN ROUTE",
  });
});

const port = process.env.PORT;
app.listen(port, () => console.log(`Server is listening on port ${port}`));
