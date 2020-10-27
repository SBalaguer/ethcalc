'use strict';

const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  name: {
    type: String,
    trim: true
  },
  day: {
      type: Number
    },
   ethPrice: {
    type: Number
    },
    ethFeesSpent: {
            type: Number
    },
    usdFeesSpent: {
        type: Number
    },
    ethFeesUsed: {
        type: Number
    },
    usdFeesUsed: {
        type: Number
    }
});

module.exports = mongoose.model('Export', schema);
