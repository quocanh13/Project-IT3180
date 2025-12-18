import { HoKhau, ServerResponse } from "../utils/data-types.mjs";

/**
 * Request để lấy danh sách hộ khẩu 
 * @param {number} offset - Vị trí bắt đầu để lấy danh sách hộ khẩu - Mặc định là 0
 * @param {number} limit - Số lượng hộ khẩu được lấy, nếu là -1 thì lấy toàn bộ - Mặc định là 20
 * @returns {Promise<ServerResponse>}
 */
export async function getHoKhau(offset = 0, limit = 20) {

    const res = await fetch(
        `/ho_khau?offset=${offset}&limit=${limit}`,
        {
            method : "GET"
        }
    );

    return await res.json();
}

/**
 * Request để thêm hộ khẩu
 * @param {HoKhau} hoKhau - Thông tin về hộ khẩu cần thêm
 * @returns {Promise<ServerResponse>}
 */
export async function insertHoKhau(hoKhau) {
    const res = await fetch(
        `/ho_khau`,
        {
            method : "POST",
            body : JSON.stringify(hoKhau),
            headers : {
                "content-type" : "application/json"
            }
        }
    );

    return await res.json();
}

/**
 * Request để cập nhật hộ khẩu
 * @param {HoKhau} hoKhau - Chỉ cập nhật các thuộc tính khác null và undefined
 * @returns {Promise<ServerResponse>}
 */
export async function updateHoKhau(hoKhau) {
    const res = await fetch(
        `/ho_khau/${hoKhau.chuHo}`,
        {
            method : "PUT",
            headers : {
                "Content-Type" : "application/json"
            },
            body : JSON.stringify(hoKhau)
        }
    );

    return await res.json();
}

/**
 * Request để xóa hộ khẩu
 * @param {number} chuHo
 * @returns {Promise<ServerResponse>}
 */
export async function deleteHoKhau(chuHo) {
    const res = fetch(
        `/ho_khau/${chuHo}`,
        {
            method : "DELETE"
        }
    )

    return await res.json();
}
