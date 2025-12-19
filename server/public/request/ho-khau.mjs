/**
 * Request để lấy danh sách hộ khẩu (Mảng số CCCD của chủ hộ)
 * @param offset - Vị trí bắt đầu để lấy danh sách hộ khẩu - Mặc định là 0
 * @param limit - Số lượng hộ khẩu được lấy, nếu là -1 thì lấy toàn bộ - Mặc định là 20
 * @returns - Nếu thành công thì data là mảng lưu số cccd của chủ hộ
 */
export async function getHoKhauList(offset = 0, limit = 20) {
    const res = await fetch(`/ho_khau?offset=${offset}&limit=${limit}`, {
        method: "GET"
    });
    return await res.json();
}
/**
 * Request để lấy thông tin về hộ gia đình tương ứng với chuHo
 * @param chuHo - Số CCCD của chủ hộ
 * @returns - Thông tin về hộ
 */
export async function getHoKhau(chuHo) {
    const res = await fetch(`/ho-khau/${chuHo}`, {
        method: "GET",
    });
    return await res.json();
}
/**
 * Request để thêm hộ khẩu
 * @param hoKhau - Thông tin về hộ khẩu cần thêm
 */
export async function insertHoKhau(hoKhau) {
    const res = await fetch(`/ho_khau`, {
        method: "POST",
        body: JSON.stringify(hoKhau),
        headers: {
            "content-type": "application/json"
        }
    });
    return await res.json();
}
/**
 * Request để cập nhật hộ khẩu
 * @param hoKhau - Chỉ cập nhật các thuộc tính khác null và undefined
 * @returns
 */
export async function updateHoKhau(hoKhau) {
    const res = await fetch(`/ho_khau/${hoKhau.chuHo}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(hoKhau)
    });
    return await res.json();
}
/**
 * Request để xóa hộ khẩu
 * @param chuHo - Số CCCD của chủ hộ
 * @returns
 */
export async function deleteHoKhau(chuHo) {
    const res = await fetch(`/ho_khau/${chuHo}`, {
        method: "DELETE"
    });
    return await res.json();
}
