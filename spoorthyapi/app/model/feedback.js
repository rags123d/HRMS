const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FeedbackSchema = new Schema({
    Type: String,
    FeedbackRemarks: String,
    FeedbackPhoto: String,
    SubmittedBy: String
    //Employee: { type: Schema.Types.ObjectId, ref: 'Employee' }
}, {
    timestamps: true
})
module.exports = mongoose.model('Feedback', FeedbackSchema)