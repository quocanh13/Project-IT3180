import { NhanKhau } from "../../public/utils/data-types.mjs";

/**
 * Hàm lấy danh sách nhân khẩu 
 * @param {number} offset - Vị trí bắt đầu. Mặc định là 0
 * @param {number} limit - Số lượng nhân khẩu được lấy. Mặc định là 10
 * @returns {Promise<NhanKhau[] | "ERROR">}
 * - Trả về danh sách nhân khẩu (NhanKhau[]) nếu thành công
 * 
 * - Trả về "ERROR" nếu có lỗi
 */
export async function getNhanKhauList(offset = 0, limit = 10) {

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
    
}

/**
 * Hàm thêm một nhân khẩu vào database
 * @param {NhanKhau} nhanKhau - Thông tin nhân khẩu cần thêm
 * @returns {Promise<"OK" | "ERROR | "NHÂN KHẨU ĐÃ TỒN TẠI">}
 * - Trả về "OK" nếu thêm thành công
 * - Trả về "ERROR" nếu có lỗi
 * - Trả về "NHÂN KHẨU ĐÃ TỒN TẠI" nếu nhân khẩu đã có trong database
 */
export async function insertNhanKhau(nhanKhau) {
    
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
    
}