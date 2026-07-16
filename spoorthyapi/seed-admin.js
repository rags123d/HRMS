require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./app/model/user');
const Role = require('./app/model/role');
const GeneralUtils = require('./app/utils/generalUtils');
const uri = process.env.DATA_BASE_PATH || 'mongodb://localhost:27017/spoorthy_db';

(async () => {
  try {
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');

    let role = await Role.findOne({ name: 'Admin' });
    if (!role) {
      role = await Role.create({ name: 'Admin' });
      console.log('Created role Admin', role._id.toString());
    } else {
      console.log('Found role Admin', role._id.toString());
    }

    const userNameEnc = GeneralUtils.encrypt('HR');
    const passwordEnc = GeneralUtils.encrypt('Admin@123');

    let user = await User.findOne({ userName: userNameEnc });
    if (!user) {
      user = new User({
        firstName: 'HR',
        lastName: 'Admin',
        userName: userNameEnc,
        password: passwordEnc,
        email: 'hr@example.com',
        mobile: '9000000000',
        role: role._id,
        approved: 1,
        isDeleted: false,
      });
      await user.save();
      console.log('Created user HR with admin credentials');
    } else {
      user.password = passwordEnc;
      user.role = role._id;
      user.email = 'hr@example.com';
      user.mobile = '9000000000';
      await user.save();
      console.log('Updated user HR with admin credentials');
    }

    console.log('Login credentials are:');
    console.log('  userName: HR (base64:', userNameEnc + ')');
    console.log('  password: Admin@123 (base64:', passwordEnc + ')');
    process.exit(0);
  } catch (e) {
    console.error('Error', e);
    process.exit(1);
  }
})();
