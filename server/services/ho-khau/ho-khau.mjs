import { HoKhau } from "../../public/utils/data-types.mjs";

/**
 * Hàm lấy thông tin nhân khẩu
 * @param {number} offset - Vị trí bắt đầu 
 * @param {number} limit - Số lượng, nếu là -1 thì lấy toàn bộ nhân khẩu
 * @returns {Promise<HoKhau[] | "ERROR">} - Trả về danh sách hộ khẩu | Trả về "ERROR" nếu có lỗi
 */
export async function getHoKhau(offset, limit) {
    
}

/**
 * Hàm thêm một hộ khẩu mới
 * @param {HoKhau} hoKhau 
 * @returns {Promise<"OK" | "ERROR" | "HỘ ĐÃ TỒN TẠI">}
 * Trả về "OK" nếu thành công
 * 
 * Trả về "ERROR" nếu có lỗi
 * 
 * Trả về "HỘ ĐÃ TỒN TẠI" nếu chủ hộ của hộ khẩu được thêm vào đã là chủ hộ của một hộ khác (1 người chỉ được là chủ hộ của 1 hộ)
 */
export async function insertHoKhau(hoKhau) {
    
}

/**
 * Hàm xóa một hộ
 * @param {number} chuHo 
 * @returns {Promise<"OK" | "ERROR">}
 * Trả về "OK" nếu thành công
 * 
 * Trả về "ERROR" nếu có lỗi
 */
export async function deleteHoKhau(chuHo) {
    
}

/**
 * Hàm cập nhật thông tin hộ khẩu
 * @param {HoKhau} hoKhau - Kiểm tra từng thuộc tính nếu khác null và undefined thì cập nhật còn không thì bỏ qua
 * @returns {Promise<"OK" | "ERROR">}
 * Trả về "OK" nếu thành công
 * 
 * Trả về "ERROR" nếu có lỗi
 */
export async function updateHoKhau(hoKhau) {
    
}