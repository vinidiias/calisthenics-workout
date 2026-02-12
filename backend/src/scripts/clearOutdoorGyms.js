// src/scripts/clearOutdoorGyms.js
require('dotenv').config();
const mongoose = require('mongoose');
const OutdoorGym = require('../Models/OutdoorGym');

mongoose.connect(process.env.DB_URI)
  .then(async () => {
    await OutdoorGym.deleteMany({});
    process.exit();
  })
  .catch(err => {
    process.exit(1);
  });
