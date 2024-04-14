import mongoose from 'mongoose';
import { config } from 'dotenv';
config();
// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI;
mongoose.connect(
  MONGODB_URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
).catch(error => console.error(error));

console.log("DB connected successfully.");

const schema = new mongoose.Schema({
  url: String,
  customName: String,
});

const user = mongoose.model("user", schema); //collection
export default user;