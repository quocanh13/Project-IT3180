import mongoose from "../database.mjs";

const { Schema, model } = mongoose;

const nop_tienSchema = Schema({
    maKhoanThu : {type : Number, require: true},
    nguoiNop : {type : String, required : true},
    soTien : {type : Number, required : true},
    ngayNop : {type : Date, required : true},
    deleted : {type : Boolean, default: false},
    deletedAt : {type : Date, default: null}
}, 
{ timestamps: true }
);

/**@type {mongoose.Model} */
const NopTien = model("nop_tien", nop_tienSchema);

export default NopTien;