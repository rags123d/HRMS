require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./app/model/user');
const uri = process.env.DATA_BASE_PATH || 'mongodb://localhost:27017/spoorthy_db';

(async () => {
  try {
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    const u = await User.findOne({ firstName: 'HR' }).populate('role');
    if (!u) {
      console.log('User HR not found');
    } else {
      console.log('Found user:', {
        id: u._id.toString(),
        userName: u.userName,
        password: u.password,
        role: u.role ? u.role.name : null,
        email: u.email,
        mobile: u.mobile,
      });
    }
    process.exit(0);
  } catch (err) {
    console.error('Error', err);
    process.exit(1);
  }
})();
