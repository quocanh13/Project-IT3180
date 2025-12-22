import { NhanKhau } from "server/public/utils/data-types.d.mts";

/**
 * Hàm lấy danh sách nhân khẩu 
 * @param offset - Vị trí bắt đầu 
 * @param limit - Số lượng nhân khẩu được lấy
 * - Trả về danh sách nhân khẩu (NhanKhau[]) nếu thành công
 * 
 * - Trả về "ERROR" nếu có lỗi
 */
declare export function getNhanKhauList(offset : number = 0, limit : number = 10) : Promise<NhanKhau[] | "ERROR">; 


/**
 * Hàm lấy thông tin về một nhân khẩu theo số CCCD
 * @param cccd - Số CCCD
 * - Trả về thông tin nhân khẩu (NhanKhau) nếu thành công
 * - Trả về "NHÂN KHẨU KHÔNG TỒN TẠI" nếu nhân khẩu không tồn tại
 * - Trả về "ERROR nếu có lỗi
 */
declare export function getNhanKhau(cccd : number) : Promise<NhanKhau | "ERROR" | "NHÂN KHẨU KHÔNG TỒN TẠI">