import LichSu from "../../config/models/lich_su-model.mjs";
/**
 * Hàm lấy danh sách lịch sử sinh sống của các căn hộ
 * @param {number} offset - Vị trí bắt đầu 
 * @param {number} limit - Số lượng, nếu là -1 thì lấy toàn bộ 
 * @returns {Promise<number[] | "ERROR">}
 */
export async function getLichSuList(canHoFilter = null) {
    try {
        let condition = { deleted: false };
        if (canHoFilter) condition.canHo = canHoFilter;

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