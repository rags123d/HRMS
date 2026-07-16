const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LanguagesKnownSchema = new Schema({
    Language: { type: Schema.Types.ObjectId, ref: 'Language' },
    Speak: Boolean,
    Read: Boolean,
    Write: Boolean
    //Employee: { type: Schema.Types.ObjectId, ref: 'Employee' }
}, {
    timestamps: true
})
module.exports = mongoose.model('LanguagesKnown', LanguagesKnownSchema)