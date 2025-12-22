import { NhanKhau, ServerResponse } from "../utils/data-types.mjs";
/**
 * Hàm lấy thông tin nhân khẩu dựa trên số CCCD
 * @param cccd - Số CCCD của nhân khẩu
 * @returns
 */
export declare function getNhanKhau(cccd: number): Promise<ServerResponse<NhanKhau>>;
