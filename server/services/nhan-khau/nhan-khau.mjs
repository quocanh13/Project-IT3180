import { NhanKhauModel } from "../../config/models/nhan_khau-model.mjs";
import  HoKhau  from "../../config/models/ho_khau-model.mjs";

/**
 * Hàm helper để lấy tên (phần cuối) từ họ tên
 * @param {string} hoTen - Họ tên đầy đủ
 * @returns {string} - Tên (phần cuối của họ tên)
 */
function getTen(hoTen) {
    if (!hoTen) return '';
    const parts = hoTen.trim().split(/\s+/);
    return parts[parts.length - 1];
}

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
            const nhanKhauList = await NhanKhauModel.find({ deleted: false }).populate('hoKhau');
            
            nhanKhauList.sort((a, b) => {

                const canHoA = (a.hoKhau && a.hoKhau.canHo) ? a.hoKhau.canHo : 0;
                const canHoB = (b.hoKhau && b.hoKhau.canHo) ? b.hoKhau.canHo : 0;

                if (canHoA !== canHoB) {
                    return canHoA - canHoB;
                }

                const tenA = getTen(a.hoTen);
                const tenB = getTen(b.hoTen);
                return tenA.localeCompare(tenB, 'vi');
            });
            return nhanKhauList;
        }
        const nhanKhauList = await NhanKhauModel.find({ deleted: false }).populate('hoKhau');
        
        nhanKhauList.sort((a, b) => {
            const canHoA = (a.hoKhau && a.hoKhau.canHo) ? a.hoKhau.canHo : 0;
            const canHoB = (b.hoKhau && b.hoKhau.canHo) ? b.hoKhau.canHo : 0;

            if (canHoA !== canHoB) {
                return canHoA - canHoB;
            }

            const tenA = getTen(a.hoTen);
            const tenB = getTen(b.hoTen);
            return tenA.localeCompare(tenB, 'vi');
        });
        
        return nhanKhauList.slice(offset, offset + limit);
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
        const infoNhanKhau = await NhanKhauModel.findOne({ cccd : cccd , deleted: false }).exec();
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
        const existingNhanKhau = await NhanKhauModel.findOne({ cccd: nhanKhau.cccd, deleted: false }).exec();
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
        const existingNhanKhau = await NhanKhauModel.findOne({ cccd: nhanKhau.cccd, deleted: false }).exec();
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
        const existingNhanKhau = await NhanKhauModel.findOne({ cccd: cccd , deleted: false }).populate('hoKhau').exec();
        if (!existingNhanKhau) {
            return "NHÂN KHẨU KHÔNG TỒN TẠI";
        }
        if(existingNhanKhau.hoKhau) {
            if(existingNhanKhau.hoKhau.deleted === false && existingNhanKhau.hoKhau.chuHo === cccd) {
                return "KHÔNG THỂ XÓA CHỦ HỘ";
            }
            await LichSu.updateOne({ canHo: existingNhanKhau.hoKhau.canHo, nhanKhau: existingNhanKhau._id, deleted: false }, { ngayChuyenDi: new Date() });
        }
        await NhanKhauModel.updateOne({ cccd: cccd }, { deleted: true, deletedAt: new Date() });
        return "OK";
    } catch (error) {
        console.error("Lỗi khi xóa nhân khẩu:", error);
        return "ERROR";
    }
}
export async function searchNhanKhau(keyword) {
    try {
        const cleanKeyword = keyword.trim();
        if (!cleanKeyword) return [];
        const regex = new RegExp(cleanKeyword, 'i');
        let results = [];
        const directResults = await NhanKhauModel.find({
            deleted: false,
            $or: [
                { hoTen: regex },
                { cccd: cleanKeyword }
            ]
        }).populate('hoKhau').exec();
        results = [...directResults];
        const listNguoiTrungTen = await NhanKhauModel.find({
            deleted: false,
            hoTen: regex
        }).select('cccd').exec();
        const listCCCD = listNguoiTrungTen.map(nk => nk.cccd);
        const dsHoKhau = await HoKhau.find({
            deleted: false,
            chuHo: { $in: listCCCD }
        }).select('_id').exec();
        const hoKhauIds = dsHoKhau.map(h => h._id);
        if (hoKhauIds.length > 0) {
            const thanhVienTrongHo = await NhanKhauModel.find({
                deleted: false,
                hoKhau: { $in: hoKhauIds }
            }).populate('hoKhau').exec();
 
            results = [...results, ...thanhVienTrongHo];
        }
        if (!isNaN(cleanKeyword)) {
            const canHoNumber = Number(cleanKeyword);
            const hoKhauByCanHo = await HoKhau.find({ 
                canHo: canHoNumber,
                deleted: false 
            }).select('_id');
            const idsCanHo = hoKhauByCanHo.map(h => h._id);
            if (idsCanHo.length > 0) {
                const nhanKhauCanHo = await NhanKhauModel.find({
                    deleted: false,
                    hoKhau: { $in: idsCanHo }
                }).populate('hoKhau').exec();
                results = [...results, ...nhanKhauCanHo];
            }
        }
        const uniqueResults = [];
        const seenIds = new Set();
        for (const item of results) {
            if (item && item._id) {
                const idStr = item._id.toString();
                if (!seenIds.has(idStr)) {
                    seenIds.add(idStr);
                    uniqueResults.push(item);
                }
            }
        }
        return uniqueResults;
    } catch (error) {
        console.error("Lỗi searchNhanKhau:", error);
        return "ERROR";
    }
}