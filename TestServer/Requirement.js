const mongoose = require('mongoose');


// Requirement Schema
const requirementSchema = new mongoose.Schema({
    labId: String,
    pcName: String,
    description: String,
    date: String,
    status: { type: String, default: 'Pending' },
});

const Requirement = mongoose.model('Requirement', requirementSchema);
module.exports = Requirement;