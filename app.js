const express = require('express');
require('dotenv').config();
const path = require('path');
const logger = require('morgan');
const mongoose = require('mongoose');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('connected to DB'))
  .catch((error) => console.log(error));

// restful API (based on the type of data we are GETing or POSTing)
// blogs get all blogs
// blogs/:id get/post/update/delete a blog
// comments get all commentse

app.listen(process.env.PORT || 3000);
