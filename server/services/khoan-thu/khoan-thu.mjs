import { KhoanThu } from "../../config/models/khoan_thu-model.mjs";

/**
 * Hàm lấy danh sách khoản thu 
 * @param {number} offset - Vị trí bắt đầu. Mặc định là 0
 * @param {number} limit - Số lượng khoản thu được lấy. Mặc định là 10
 * @returns {Promise<KhoanThu[] | "ERROR">}
 * - Trả về danh sách khoản thu (KhoanThu[]) nếu thành công
 * 
 * - Trả về "ERROR" nếu có lỗi
 * - Trả về toàn bộ danh sách nếu limit = -1
 */
export async function getKhoanThuList(offset = 0, limit = 10) {
    try {
        if(limit === -1) {
            const khoanThuList = await KhoanThu.find({ deleted: false });
            return khoanThuList;
        }
        const khoanThuList = await KhoanThu.find({ deleted: false }).skip(offset).limit(limit);
        return khoanThuList;
    } catch (error) {
        console.error("Lỗi khi lấy danh sách khoản thu:", error);
        return "ERROR";
    }
}

/**
 * Hàm lấy thông tin về một khoản thu theo mã khoản thu
 * @param {number} maKhoanThu - Mã khoản thu
 * @returns {Promise<KhoanThu | "ERROR" | "KHOẢN THU KHÔNG TỒN TẠI">}   
 * - Trả về thông tin khoản thu (KhoanThu) nếu thành công
 * - Trả về "KHOẢN THU KHÔNG TỒN TẠI" nếu khoản thu không tồn tại
 * - Trả về "ERROR" nếu có lỗi
 */
export async function getKhoanThu(maKhoanThu) {
    try {
        const infoKhoanThu = await KhoanThu.findOne({ maKhoanThu : maKhoanThu , deleted: false }).exec();
        if (!infoKhoanThu) {
            return "KHOẢN THU KHÔNG TỒN TẠI";
        }
        return infoKhoanThu;
    } catch (error) {
        console.error("Lỗi khi lấy thông tin khoản thu:", error);
        return "ERROR";
    }
}

/**
 * Hàm thêm một khoản thu vào database
 * @param {KhoanThu} khoanThu - Thông tin khoản thu cần thêm
 * @returns {Promise<"OK" | "ERROR" | "KHOẢN THU ĐÃ TỒN TẠI">}
 * - Trả về "OK" nếu thêm thành công
 * - Trả về "ERROR" nếu có lỗi
 * - Trả về "KHOẢN THU ĐÃ TỒN TẠI" nếu khoản thu đã có trong database
 */
export async function insertKhoanThu(khoanThu) {
    try {
        const existingKhoanThu = await KhoanThu.findOne({ maKhoanThu: khoanThu.maKhoanThu, deleted: false }).exec();
        if (existingKhoanThu) {
            return "KHOẢN THU ĐÃ TỒN TẠI";
        }else{
            const newKhoanThu = new KhoanThu(khoanThu);
            await newKhoanThu.save();
            return "OK";
        }
    } catch (error) {
        console.error("Lỗi khi thêm khoản thu:", error);
        return "ERROR";
    }
}
/**
 * Hàm cập nhật thông tin một khoản thu với mã khoản thu tương ứng trong khoanThu 
 * @param {KhoanThu} khoanThu - Thông tin khoản thu. Chỉ cập nhật các trường trong khoanThu khác null | undefined
 * @returns {Promise<"OK" | "ERROR | "KHOẢN THU KHÔNG TỒN TẠI">}
 * - Trả về "OK" nếu cập nhật thành công
 * - Trả về "ERROR" nếu có lỗi
 * - Trả về "KHOẢN THU KHÔNG TỒN TẠI" nếu khoản thu không có trong database
 */
export async function updateKhoanThu(khoanThu) {
    try {
        const existingKhoanThu = await KhoanThu.findOne({ maKhoanThu: khoanThu.maKhoanThu, deleted: false }).exec();
        if (!existingKhoanThu) {
            return "KHOẢN THU  KHÔNG TỒN TẠI";
        }
        const updateFields = {};
        for (const key in khoanThu) {
            if (khoanThu[key] !== null && khoanThu[key] !== undefined) {
                updateFields[key] = khoanThu[key];
            }
        }
        await KhoanThu.updateOne({ maKhoanThu: khoanThu.maKhoanThu }, { $set: updateFields });
        return "OK";
    } catch (error) {
        console.error("Lỗi khi cập nhật khoản thu:", error);
        return "ERROR";
    }
}
/**
/**
 * Hàm xóa một khoản thu theo mã khoản thu
 * @param {number} maKhoanThu - Mã khoản thu
 * @returns {Promise<"OK" | "ERROR" | "KHOẢN THU KHÔNG TỒN TẠI">}
 * - Trả về "OK" nếu thành công
 * 
 * - Trả về "NHÂN KHẨU KHÔNG TỒN TẠI" nếu nhân khẩu không tồn tại
 * 
 * - Trả về "ERROR" nếu có lỗi
 */
export async function deleteKhoanThu(maKhoanThu) {
    try {
        const existingKhoanThu = await KhoanThu.findOne({ maKhoanThu: maKhoanThu , deleted: false }).exec();
        if (!existingKhoanThu) {
            return "KHOẢN THU KHÔNG TỒN TẠI";
        }
        await KhoanThu.updateOne({ maKhoanThu: maKhoanThu }, { deleted: true, deletedAt: new Date() });
        return "OK";
    } catch (error) {
        console.error("Lỗi khi xóa khoản thu:", error);
        return "ERROR";
    }
}