import { NhanKhauModel } from "../../config/models/nhan_khau-model.mjs";

/**
 * Hàm lấy danh sách nhân khẩu 
 * @param {number} offset - Vị trí bắt đầu. Mặc định là 0
 * @param {number} limit - Số lượng nhân khẩu được lấy. Mặc định là 10
 * @returns {Promise<NhanKhau[] | "ERROR">}
 * - Trả về danh sách nhân khẩu (NhanKhau[]) nếu thành công
 * 
 * - Trả về "ERROR" nếu có lỗi
 * - Trả về toàn bộ danh sách nếu limit = -1
 */
export async function getNhanKhauList(offset = 0, limit = 10) {
    try {
        if(limit === -1) {
            const nhanKhauList = await NhanKhauModel.find().populate('hoKhau');
            return nhanKhauList;
        }
        const nhanKhauList = await NhanKhauModel.find().skip(offset).limit(limit).populate('hoKhau');
        return nhanKhauList;
    } catch (error) {
        console.error("Lỗi khi lấy danh sách nhân khẩu:", error);
        return "ERROR";
    }
}

/**
 * Hàm lấy thông tin về một nhân khẩu theo số CCCD
 * @param {number} cccd - Số CCCD
 * @returns {Promise<NhanKhau | "ERROR" | "NHÂN KHẨU KHÔNG TỒN TẠI">}
 * - Trả về thông tin nhân khẩu (NhanKhau) nếu thành công
 * 
 * - Trả về "NHÂN KHẨU KHÔNG TỒN TẠI" nếu nhân khẩu không tồn tại
 * 
 * - Trả về "ERROR" nếu có lỗi
 */
export async function getNhanKhau(cccd) {
    try {
        const infoNhanKhau = await NhanKhauModel.findOne({ cccd : cccd }).exec();
        if (!infoNhanKhau) {
            return "NHÂN KHẨU KHÔNG TỒN TẠI";
        }
        return infoNhanKhau;
    } catch (error) {
        console.error("Lỗi khi lấy thông tin nhân khẩu:", error);
        return "ERROR";
    }
}

/**
 * Hàm thêm một nhân khẩu vào database
 * @param {NhanKhau} nhanKhau - Thông tin nhân khẩu cần thêm
 * @returns {Promise<"OK" | "ERROR" | "NHÂN KHẨU ĐÃ TỒN TẠI">}
 * - Trả về "OK" nếu thêm thành công
 * - Trả về "ERROR" nếu có lỗi
 * - Trả về "NHÂN KHẨU ĐÃ TỒN TẠI" nếu nhân khẩu đã có trong database
 */
export async function insertNhanKhau(nhanKhau) {
    try {
        const existingNhanKhau = await NhanKhauModel.findOne({ cccd: nhanKhau.cccd }).exec();
        if (existingNhanKhau) {
            return "NHÂN KHẨU ĐÃ TỒN TẠI";
        }else{
            const newNhanKhau = new NhanKhauModel(nhanKhau);
            await newNhanKhau.save();
            return "OK";
        }
    } catch (error) {
        console.error("Lỗi khi thêm nhân khẩu:", error);
        return "ERROR";
    }
}
/**
 * Hàm cập nhật thông tin một nhân khẩu với số cccd tương ứng trong nhanKhau 
 * @param {NhanKhau} nhanKhau - Thông tin nhân khẩu. Chỉ cập nhật các trường trong nhanKhau khác null | undefined
 * @returns {Promise<"OK" | "ERROR | "NHÂN KHẨU KHÔNG TỒN TẠI">}
 * - Trả về "OK" nếu cập nhật thành công
 * - Trả về "ERROR" nếu có lỗi
 * - Trả về "NHÂN KHẨU KHÔNG TỒN TẠI" nếu nhân khẩu không có trong database
 */
export async function updateNhanKhau(nhanKhau) {
    try {
        const existingNhanKhau = await NhanKhauModel.findOne({ cccd: nhanKhau.cccd }).exec();
        if (!existingNhanKhau) {
            return "NHÂN KHẨU KHÔNG TỒN TẠI";
        }
        const updateFields = {};
        for (const key in nhanKhau) {
            if (nhanKhau[key] !== null && nhanKhau[key] !== undefined) {
                updateFields[key] = nhanKhau[key];
            }
        }
        await NhanKhauModel.updateOne({ cccd: nhanKhau.cccd }, { $set: updateFields });
        return "OK";
    } catch (error) {
        console.error("Lỗi khi cập nhật nhân khẩu:", error);
        return "ERROR";
    }
}

/**
 * Hàm xóa một nhân khẩu theo số CCCD
 * @param {number} cccd - Số CCCD
 * @returns {Promise<"OK" | "ERROR" | "NHÂN KHẨU KHÔNG TỒN TẠI">}
 * - Trả về "OK" nếu thành công
 * 
 * - Trả về "NHÂN KHẨU KHÔNG TỒN TẠI" nếu nhân khẩu không tồn tại
 * 
 * - Trả về "ERROR" nếu có lỗi
 */
export async function deleteNhanKhau(cccd) {
    try {
        const existingNhanKhau = await NhanKhauModel.findOne({ cccd: cccd }).exec();
        if (!existingNhanKhau) {
            return "NHÂN KHẨU KHÔNG TỒN TẠI";
        }
        await NhanKhauModel.deleteOne({ cccd: cccd });
        return "OK";
    } catch (error) {
        console.error("Lỗi khi xóa nhân khẩu:", error);
        return "ERROR";
    }
}