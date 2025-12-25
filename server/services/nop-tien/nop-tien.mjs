import NopTien from "../../config/models/nop_tien-model.mjs";
import KhoanThu from "../../config/models/khoan_thu-model.mjs";
import { NhanKhauModel } from "../../config/models/nhan_khau-model.mjs";
import HoKhau from "../../config/models/ho_khau-model.mjs";
/**
 * Hàm lấy danh sách người nộp tiền 
 * @param {number} offset - Vị trí bắt đầu. Mặc định là 0
 * @param {number} limit - Số lượng khoản thu được lấy. Mặc định là 10
 * @returns {Promise<KhoanThu[] | "ERROR">}
 * - Trả về danh sách khoản thu (KhoanThu[]) nếu thành công
 * 
 * - Trả về "ERROR" nếu có lỗi
 * - Trả về toàn bộ danh sách nếu limit = -1
 */

export async function getNopTienList(offset = 0, limit = 10,maKhoanThu = null) {
    try {
        let find = { deleted: false };
        if(maKhoanThu !== null) {
            find.maKhoanThu = maKhoanThu;
        }
        if(limit === -1) {
            const nopTienList = await NopTien.find(find);
            return nopTienList;
        }
        const nopTienList = await NopTien.find(find).skip(offset).limit(limit);
        return nopTienList;
    } catch (error) {
        console.error("Lỗi khi lấy danh sách nộp tiền:", error);
        return "ERROR";
    }
}

/**
 * Hàm lấy thông tin về một khoản thu theo mã khoản thu
 * @param {ObjectId} id - Mã nộp tiền
 * @returns {Promise<NopTien | "ERROR" | "HOÁ ĐƠN KHÔNG TỒN TẠI">}   
 * - Trả về thông tin khoản thu (NopTien) nếu thành công
 * - Trả về "HOÁ ĐƠN KHÔNG TỒN TẠI" nếu khoản thu không tồn tại
 * - Trả về "ERROR" nếu có lỗi
 */
export async function getNopTien(_id) {
    try {
        const infoNopTienDoc = await NopTien.findOne({ _id : _id , deleted: false }).exec();
        if (!infoNopTienDoc) {
            return "HOÁ ĐƠN KHÔNG TỒN TẠI";
        }

        const result = infoNopTienDoc.toObject();
        const khoanThu = await KhoanThu.findOne({ maKhoanThu : infoNopTienDoc.maKhoanThu, deleted: false }).exec();
        const nguoiNop = await NhanKhauModel.findOne({ cccd : infoNopTienDoc.nguoiNop, deleted: false })
                                            .populate('hoKhau')
                                            .exec();
        result.tenKhoanThu = khoanThu ? khoanThu.tenKhoanThu : "_";
        
        if (nguoiNop) {
            result.tenNguoiNop = nguoiNop.hoTen;
            result.canHo = (nguoiNop.hoKhau && nguoiNop.hoKhau.canHo) ? nguoiNop.hoKhau.canHo : "Chưa có hộ khẩu";
        } else {
            result.tenNguoiNop = "Không tìm thấy người nộp (CCCD: " + result.nguoiNop + ")";
            result.canHo = "_";
        }

        return result;

    } catch (error) {
        console.error("Lỗi khi lấy thông tin nộp tiền:", error);
        return "ERROR";
    }
}


/**
 * Hàm thêm một hoá đơn vào database
 * @param {NopTien} nopTien - Thông tin hoá đơn cần thêm
 * @returns {Promise<"OK" | "ERROR" | "ĐÃ NỘP TIỀN">}
 * - Trả về "OK" nếu thêm thành công
 * - Trả về "ERROR" nếu có lỗi
 * - Trả về "ĐÃ NỘP TIỀN" nếu người nộp tiền đã nộp tiền cho khoản thu đó
 */
export async function insertNopTien(nopTien) {
    try {
        const existingNopTien = await NopTien.findOne({ maKhoanThu: nopTien.maKhoanThu, nguoiNop: nopTien.nguoiNop, deleted: false }).exec();
        if (existingNopTien) {
            return "ĐÃ NỘP TIỀN";
        }else{
            const newNopTien = new NopTien(nopTien);
            await newNopTien.save();
            return "OK";
        }
    } catch (error) {
        console.error("Lỗi khi thêm một hoá đơn:", error);
        return "ERROR";
    }
}
/**
 * Hàm cập nhật thông tin một khoản thu với mã khoản thu tương ứng trong khoanThu 
 * @param {ObjectId} id - id của hoá đơn. Chỉ cập nhật các trường trong nopTien khác null | undefined
 * @returns {Promise<"OK" | "ERROR | "HOÁ ĐƠN KHÔNG TỒN TẠI">}
 * - Trả về "OK" nếu cập nhật thành công
 * - Trả về "ERROR" nếu có lỗi
 * - Trả về "HOÁ ĐƠN KHÔNG TỒN TẠI" nếu hoá đơn không có trong database
 */
export async function updateNopTien(nopTien) {
    try {
        const existingNopTien = await NopTien.findOne({ _id: nopTien._id, deleted: false }).exec();
        if (!existingNopTien) {
            return "HOÁ ĐƠN KHÔNG TỒN TẠI";
        }
        const updateFields = {};
        for (const key in nopTien) {
            if (nopTien[key] !== null && nopTien[key] !== undefined) {
                updateFields[key] = nopTien[key];
            }
        }
        await NopTien.updateOne({ _id: nopTien._id }, { $set: updateFields });
        return "OK";
    } catch (error) {
        console.error("Lỗi khi cập nhật hoá đơn:", error);
        return "ERROR";
    }
}
/**
/**
 * Hàm xóa một khoản thu theo mã khoản thu
 * @param {ObjectId} id - Mã khoản thu
 * @returns {Promise<"OK" | "ERROR" | "HOÁ ĐƠN KHÔNG TỒN TẠI">} 
 * - Trả về "OK" nếu thành công
 * 
 * - Trả về "HOÁ ĐƠN KHÔNG TỒN TẠI" nếu hoá đơn không tồn tại
 * 
 * - Trả về "ERROR" nếu có lỗi
 */
export async function deleteNopTien(_id) {
    try {
        const existingNopTien = await NopTien.findOne({ _id: _id , deleted: false }).exec();
        if (!existingNopTien) {
            return "HOÁ ĐƠN KHÔNG TỒN TẠI";
        }
        await NopTien.updateOne({ _id: _id }, { deleted: true, deletedAt: new Date() });
        return "OK";
    } catch (error) {
        console.error("Lỗi khi xóa hoá đơn:", error);
        return "ERROR";
    }
}