const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const autoIncrement = require("mongoose-auto-increment");

const UserSchema = new Schema({
    firstName: String,
    lastName: String,
    userName: String,
    password: String,
    email: String,
    mobile: String,
    workStatus: String,
    photo: String,
    age: Number,
    presentAddress: String,
    permanentAddress: String,
    role: { type: Schema.Types.ObjectId, ref: 'Role' },
    age: Number,
    gender: { type: Schema.Types.ObjectId, ref: 'Gender' },
    place: String,
    languages: String,

    isLeave: { type: Boolean, default: false },
    statusDatetime: Date,

    latitude: { type: Number, default: 0 },
    longitude: { type: Number, default: 0 },
    locationRemark: String,
    locationDatetime: Date,

    approved: { type: Number, default: 0 },
    loggedInDatetime: Date,
    endOfDay: { type: Date, default: new Date().setHours(23, 59, 59, 999) },
    isDeleted: { type: Boolean, default: false },
}, {
    timestamps: true
})

autoIncrement.initialize(mongoose.connection);
UserSchema.plugin(autoIncrement.plugin, {
  model: "User", 
  field: "UserId", 
  startAt: 1, 
  incrementBy: 1, 
});
module.exports = mongoose.model('User', UserSchema)