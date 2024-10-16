import mongoose from "mongoose";

const connect=()=>{
mongoose.connect('mongodb://localhost:27017/roleBasedAccess', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('MongoDB connection error:', err));
}

export default connect;