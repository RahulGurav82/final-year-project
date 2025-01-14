const mongoose = require('mongoose');

const pcSchema = new mongoose.Schema({
  pcName: {
    type: String,
    required: true,
  },
  labId: {
    type: String,
    required: true,
  },
});

const PC = mongoose.model('PC', pcSchema);

module.exports = PC;