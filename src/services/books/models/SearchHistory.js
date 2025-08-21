const mongoose = require('mongoose');

const searchHistorySchema = new mongoose.Schema({
  query: {
    type: String,
    required: true,
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('SearchHistory', searchHistorySchema);
