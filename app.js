const express = require('express');
require('dotenv').config();
const path = require('path');
const logger = require('morgan');
const mongoose = require('mongoose');

const app = express();

app.use(express.json());
app.use(express.urlencoded({}));

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('connected to DB'))
  .catch((error) => console.log(error));

app.listen(process.env.PORT || 3000);
