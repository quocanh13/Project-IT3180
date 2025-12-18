import { HoKhau, ServerResponse } from "../utils/data-types.mjs";
/**
 * Request để lấy danh sách hộ khẩu
 * @param offset - Vị trí bắt đầu để lấy danh sách hộ khẩu - Mặc định là 0
 * @param limit - Số lượng hộ khẩu được lấy, nếu là -1 thì lấy toàn bộ - Mặc định là 20
 * @returns - Nếu thành công thì data là mảng lưu số cccd của chủ hộ
 */
export declare function getHoKhau(offset?: number, limit?: number): Promise<ServerResponse>;
/**
 * Request để thêm hộ khẩu
 * @param hoKhau - Thông tin về hộ khẩu cần thêm
 */
export declare function insertHoKhau(hoKhau: HoKhau): Promise<ServerResponse>;
/**
 * Request để cập nhật hộ khẩu
 * @param hoKhau - Chỉ cập nhật các thuộc tính khác null và undefined
 * @returns
 */
export declare function updateHoKhau(hoKhau: HoKhau): Promise<ServerResponse>;
/**
 * Request để xóa hộ khẩu
 * @param chuHo - Số CCCD của chủ hộ
 * @returns
 */
export declare function deleteHoKhau(chuHo: number): Promise<ServerResponse>;
