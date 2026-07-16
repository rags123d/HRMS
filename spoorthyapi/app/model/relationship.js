const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RelationshipSchema = new Schema({
    name: String,
    isDeleted: { type: Boolean, default: false },
}, {
    timestamps: true
})
module.exports = mongoose.model('Relationship', RelationshipSchema)