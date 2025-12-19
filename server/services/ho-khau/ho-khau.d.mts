import { HoKhau } from "../../public/utils/data-types.mjs";

/**
 * Hàm lấy danh sách hộ khẩu
 * @param offset - Vị trí bắt đầu 
 * @param limit - Số lượng, nếu là -1 thì lấy toàn bộ nhân khẩu
 * @returns Trả về mảng lưu số CCCD của chủ hộ | Trả về "ERROR" nếu có lỗi
 */
export function getHoKhauList(offset : number, limit : number) : Promise<number[] | "ERROR">;

/**
 * Hàm lấy thông tin về hộ có chủ hộ tương ứng
 * @param chuHo 
 * Trả về HoKhau nếu thành công
 * 
 * Trả về "ERROR" nếu có lỗi
 */
export function getHoKhau(chuHo : number) : Promise<HoKhau | "ERROR" | "HỘ KHẨU KHÔNG TỒN TẠI">

/**
 * @param hoKhau - Thông tin về hộ khẩu để thêm vào
 * Hàm thêm một hộ khẩu mới
 * 
 * Trả về "OK" nếu thành công
 * 
 * Trả về "ERROR" nếu có lỗi
 * 
 * Trả về "HỘ ĐÃ TỒN TẠI" nếu chủ hộ của hộ khẩu được thêm vào đã là chủ hộ của một hộ khác (1 người chỉ được là chủ hộ của 1 hộ)
 */
export function insertHoKhau(hoKhau : HoKhau) : Promise<"OK" | "ERROR" | "HỘ ĐÃ TỒN TẠI">;

/**
 * @param chuHo - Số CCCD của chủ hộ
 * Hàm xóa một hộ
 * 
 * Trả về "OK" nếu thành công
 * 
 * Trả về "ERROR" nếu có lỗi
 * 
 * Trả về "HỘ KHÔNG TỒN TẠI" nếu hộ không tồn tại
 */
export function deleteHoKhau(chuHo : number) : Promise<"OK" | "ERROR" | "HỘ KHÔNG TỒN TẠI">;

/**
 * @param hoKhau - Thông tin về hộ khẩu để cập nhật
 * Hàm cập nhật thông tin hộ khẩu. Chỉ cập nhật những trường trong hoKhau mà khác null và undefined
 * 
 * Trả về "OK" nếu thành công
 * 
 * Trả về "ERROR" nếu có lỗi
 * 
 * Trả về "HỘ KHÔNG TỒN TẠI" nếu hộ không tồn tại
 */
export function updateHoKhau(hoKhau : HoKhau) : Promise<"OK" | "ERROR" | "HỘ KHÔNG TỒN TẠI">;