const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const autoIncrement = require("mongoose-auto-increment");

const SharedUsersSchema = new Schema({
    name: String,
    phoneNo: String,
    sharelink: String,
}, {
    timestamps: true
})

autoIncrement.initialize(mongoose.connection);
SharedUsersSchema.plugin(autoIncrement.plugin, {
  model: "SharedUsers", 
  field: "SharedUserId", 
  startAt: 1, 
  incrementBy: 1, 
});
module.exports = mongoose.model('SharedUsers', SharedUsersSchema)