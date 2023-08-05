const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema.Types
const contactUsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  user: {
    type: ObjectId,
    ref: 'User',

  }
});

const ContactUs = mongoose.model('ContactUs', contactUsSchema);

module.exports = ContactUs;
