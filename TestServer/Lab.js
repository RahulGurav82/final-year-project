const mongoose = require('mongoose');

const labSchema = new mongoose.Schema({
  labName: {
    type: String,
    required: true,
  },
  capacity: {
    type: Number,
    required: true,
  },
  labId: {
    type: String,
    unique: true,
    required: true,
  },
});

const Lab = mongoose.model('Lab', labSchema);

module.exports = Lab;