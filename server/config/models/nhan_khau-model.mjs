import mongoose from "../database.mjs";

const { Schema, model } = mongoose;

const nhan_khauSchema = Schema({
    cccd : {type : Number, required : true, unique : true},
    hoTen : {type : String, required : true},
    gioiTinh : {type : Boolean, required : true}, // True là nam, false là nữ
    ngaySinh : {type : Date, required : true},
    danToc : {type : String, required : true},
    quocTich : {type : String, required : true},
    queQuan : {type : String, required : true},
    noiSinh : {type : String, required : true},
    hoKhau : {type : Number, required : true},
    quanHeVoiChuHo : {type : String, required : true}
});

/**@type {mongoose.Model} */
const NhanKhauModel = model("nhan_khau", nhan_khauSchema);

export { NhanKhauModel };