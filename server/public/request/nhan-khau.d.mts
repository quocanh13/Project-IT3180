import { NhanKhau, ServerResponse } from "../utils/data-types.mjs";
/**
 * Hàm lấy thông tin nhân khẩu dựa trên số CCCD
 * @param cccd - Số CCCD của nhân khẩu
 * @returns - Trả về thông tin về nhân khẩu
 */
export declare function getNhanKhau(cccd: number): Promise<ServerResponse<NhanKhau>>;
/**
 * Hàm lấy thông tin nhân khẩu dựa trên số CCCD
 * @param offset - Vị trí bắt đầu
 * @param limit - Số lượng nhân khẩu được lấy
 * @returns - Trả về danh sách nhân khẩu nếu thành công
 */
export declare function getNhanKhauList(offset?: number, limit?: number): Promise<ServerResponse<NhanKhau[]>>;
/**
 * Hàm thêm một nhân khẩu vào danh sách nhân khẩu
 * @param nhanKhau - Thông tin nhân khẩu
 * @returns
 */
export declare function insertNhanKhau(nhanKhau: NhanKhau): Promise<ServerResponse>;
/**
 * Hàm cập nhật thông tin một nhân khẩu trong danh sách nhân khẩu
 * @param nhanKhau - Thông tin nhân khẩu. Chỉ cập nhật các trường khác null | undefined
 * @returns
 */
export declare function updateNhanKhau(nhanKhau: NhanKhau): Promise<ServerResponse>;
/**
 * Hàm xóa một nhân khẩu có số CCCD tương ứng khỏi danh sách nhân khẩu
 * @param cccd - Số CCCD của nhân khẩu
 * @returns
 */
export declare function deleteNhanKhau(cccd: number): Promise<ServerResponse>;
