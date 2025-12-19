import mongoose from "../database.mjs"
import { InferSchemaType } from "mongoose";

const userSchema = Schema({
    username : {type : String, required : true, unique : true},
    password : {type : String, required : true},
    role : {type : String, enum: ['admin', 'user'], default: 'admin'}
});

type Account = {
    username : string,
    password : string,
    role : string
}

declare const User: mongoose.Model<Account>;
export default User;