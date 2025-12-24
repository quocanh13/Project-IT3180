import mongoose from "../database.mjs";

const { Schema, model } = mongoose;

const ho_khauSchema = Schema({
    chuHo : {type : String, required : true, unique : true},
    canHo : {type : Number,unique : true},
    ngayDK : {type : Date},
    deleted : {type : Boolean, default: false},
    deleteAt : {type : Date, default: null}
}, 
{ timestamps: true }
);

/**@type {mongoose.Model} */
const HoKhau = model("ho_khau", ho_khauSchema);

export default HoKhau;