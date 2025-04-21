// src/scripts/clearOutdoorGyms.js
require('dotenv').config();
const mongoose = require('mongoose');
const OutdoorGym = require('../Models/OutdoorGym');

mongoose.connect(process.env.DB_URI)
  .then(async () => {
    const result = await OutdoorGym.deleteMany({});
    console.log(`🗑️ Removidos ${result.deletedCount} gyms`);
    process.exit();
  })
  .catch(err => {
    console.error('❌ Erro ao remover gyms:', err);
    process.exit(1);
  });
