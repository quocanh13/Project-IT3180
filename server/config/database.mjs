import mongoose from "mongoose";
import dotenv from "dotenv"

dotenv.config();

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.si8bzcc.mongodb.net/?appName=Cluster0`
await mongoose.connect(uri);
export default mongoose;