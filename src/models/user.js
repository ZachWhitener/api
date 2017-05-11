import mongoose from 'mongoose';
import bcrypt from 'bcrypt-nodejs';

let userSchema = mongoose.Schema({
  name: String,
  username: String,
  email: String,
  password: String
}, {
  timestamps: true
});

// Generating a hash for the password
userSchema.methods.generateHash = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
}

// Checking if password is validPassword
userSchema.methods.isValidPassword = function(password) {
  console.log(this);
  return bcrypt.compareSync(password, this.password);
}

export default mongoose.model('User', userSchema);
