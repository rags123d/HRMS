const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OccupationSchema = new Schema({
    name: String
}, {
    timestamps: true
})
module.exports = mongoose.model('Occupation', OccupationSchema)