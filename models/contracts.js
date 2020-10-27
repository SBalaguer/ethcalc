'use strict';

const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    unique: true
  },
  contracts: [{
    type: String,
    trim: true
  }]
});

module.exports = mongoose.model('Contracts', schema);
