import mongoose from "../database.mjs";

const { Schema, model } = mongoose;

const ho_khauSchema = Schema({
    chuHo : {type : Number, required : true, unique : true},
    thanhVien : {type : [Number]},
    noiCuTru : {type : Number},
    ngayDangKyThuongTru : {type : Date}
});

/**@type {mongoose.Model} */
const HoKhau = model("ho_khau", ho_khauSchema);
export default HoKhau;