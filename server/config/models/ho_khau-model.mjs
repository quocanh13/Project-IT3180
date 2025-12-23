import mongoose from "../database.mjs";

const { Schema, model } = mongoose;

const ho_khauSchema = Schema({
    chuHo : {type : String, required : true, unique : true},
    thanhVien : {type : [String]},
    soNha : {type : Number,unique : true},
    ngayDK : {type : Date}
});

/**@type {mongoose.Model} */
const HoKhau = model("ho_khau", ho_khauSchema);

export default HoKhau;