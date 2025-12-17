import { ServerResponse } from "../utils/data-types.mjs";

/**
 * Hàm lấy danh sách hộ khẩu 
 * @param {number} offset - Vị trí bắt đầu để lấy danh sách hộ khẩu - Mặc định là 0
 * @param {number} limit - Số lượng hộ khẩu được lấy, nếu là -1 thì lấy toàn bộ - Mặc định là 20
 * @returns {ServerResponse}
 */
export async function getHoKhau(offset = 0, limit = 20) {

    const res = await fetch(
        `/nhan_khau?offset=${offset}&limit=${limit}`,
        {
            method : "GET"
        }
    );

    return await res.json();
}