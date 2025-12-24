import mongoose from "../database.mjs";

const { Schema, model } = mongoose;

const userSchema = Schema({
    username : {type : String, required : true, unique : true},
    password : {type : String, required : true},
    role : {type : String, enum: ['admin', 'user'], default: 'admin'},
    deleted : {type : Boolean, default : false},
    deletedAt : {type : Date, default : null}
},
{ timestamps: true }
);

/**@type {mongoose.Model} */
const User = model("user", userSchema);

export default User;