import LichSu from "../../config/models/lich_su-model.mjs";
import {NhanKhauModel} from "../../config/models/nhan_khau-model.mjs";
/**
 * Hàm lấy danh sách lịch sử sinh sống của các căn hộ
 * @param {number} offset - Vị trí bắt đầu 
 * @param {number} limit - Số lượng, nếu là -1 thì lấy toàn bộ 
 * @returns {Promise<number[] | "ERROR">}
 */
export async function getLichSuList(searchValue = null) {
    try {
        let condition = { deleted: false };
        if (searchValue) {
            const searchStr = searchValue.toString().trim();
            if (searchStr.length === 12) {
                const nhanKhau = await NhanKhauModel.findOne({ cccd: searchStr });
                if (nhanKhau) {
                    condition.nhanKhau = nhanKhau._id;
                } else {
                    return [];
                }
            } else {
                const canHoNumber = parseInt(searchStr, 10);               
                if (!isNaN(canHoNumber)) {
                    condition.canHo = canHoNumber;
                } else {
                    return [];
                }
            }
        }
        const list = await LichSu.find(condition)
            .sort({ canHo: 1, ngayDK: -1 })
            .populate("nhanKhau");
        const grouped = list.reduce((acc, item) => {
            const key = item.canHo;
            if (!acc[key]) {
                acc[key] = { soPhong: key, lichSuNguoiO: [] };
            }
            acc[key].lichSuNguoiO.push({
                idLichSu: item._id,
                cccd: item.nhanKhau?.cccd || "Không rõ",
                hoTen: item.nhanKhau?.hoTen || "Không rõ",
                ngayVao: item.ngayDK,
                ngayRa: item.ngayChuyenDi,
                trangThai: item.ngayChuyenDi ? "Đã dời đi" : "Đang cư trú"
            });
            return acc;
        }, {});

        return Object.values(grouped);
    } catch (error) {
        console.error("Lỗi getLichSuList:", error);
        throw error;
    }
}
export async function filterLichSu(status) {
    try {
        let condition = { deleted: false };
        if (status === "active") {
            condition.ngayChuyenDi = null;
        } else if (status === "moved") {
            condition.ngayChuyenDi = { $ne: null };
        }  
        const list = await LichSu.find(condition)
            .sort({ canHo: 1, ngayDK: -1 })
            .populate("nhanKhau");
        const grouped = list.reduce((acc, item) => {
            const key = item.canHo;
            if (!acc[key]) {
                acc[key] = { soPhong: key, lichSuNguoiO: [] };
            }
            acc[key].lichSuNguoiO.push({
                idLichSu: item._id,
                cccd: item.nhanKhau?.cccd || "Không rõ",
                hoTen: item.nhanKhau?.hoTen || "Không rõ",
                ngayVao: item.ngayDK,
                ngayRa: item.ngayChuyenDi,
                trangThai: item.ngayChuyenDi ? "Đã dời đi" : "Đang cư trú"
            });
            return acc;
        }, {});

        return Object.values(grouped);
    } catch (error) {
        throw error;
    }
}