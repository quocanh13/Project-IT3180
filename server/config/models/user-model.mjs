import mongoose from "../database.mjs";

const { Schema, model } = mongoose;

const userSchema = Schema({
    username : {type : String, required : true, unique : true},
    password : {type : String, required : true}
});

const User = model("user", userSchema);
export default User;