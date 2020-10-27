'use strict';

const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  project: {
    type: mongoose.Types.ObjectId,
    ref: 'Contracts'
  },
  data:[
      {
        day: Number,
        ethPrice: Number,
        ethFeesSpent: Number,
        usdFeesSpent: Number,
        ethFeesUsed: Number,
        usdFeesUsed: Number
      }
  ]
},{ timestamps: true });

module.exports = mongoose.model('Data', schema);
