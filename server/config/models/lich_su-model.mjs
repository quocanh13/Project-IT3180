import mongoose from "../database.mjs";

const { Schema, model } = mongoose;

const lich_suSchema = Schema({
    canHo: {type : Number, required : true},
    nhanKhau: {type : mongoose.Schema.Types.ObjectId, ref : "nhan_khau", required : true},
    ngayDK: {type : Date, required : true},
    ngayChuyenDi: {type : Date, default : null},
    deleted : {type : Boolean, default: false},
    deletedAt : {type : Date, default: null}
}, 
{ timestamps: true }
);

/**@type {mongoose.Model} */
const LichSu = model("lich_su", lich_suSchema);

export default LichSu;