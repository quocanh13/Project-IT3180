import mongoose from "../database.mjs";

const { Schema, model } = mongoose;

const khoan_thuSchema = Schema({
    maKhoanThu: { 
        type: Number, 
        unique: true,
        default: () => Math.floor(Math.random() * 100000000000) 
    },
    tenKhoanThu: { type: String, required: true },
    loaiKhoanThu: { 
        type: String, 
        required: true, 
        enum: ['bắt buộc', 'tự nguyện'] 
    },
    soTien: { type: Number, required: true },
    deleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null }
}, 
{ timestamps: true }
);

/**@type {mongoose.Model} */
const KhoanThu = model("khoan_thu", khoan_thuSchema);

export default KhoanThu;