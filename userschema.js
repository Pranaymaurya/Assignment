import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    name: String,
    role: String,
  });
  
  const User = mongoose.model('User', userSchema);

  export default User;