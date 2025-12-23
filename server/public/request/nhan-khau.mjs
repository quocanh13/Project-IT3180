/**
 * Hàm lấy thông tin nhân khẩu dựa trên số CCCD
 * @param cccd - Số CCCD của nhân khẩu
 * @returns - Trả về thông tin về nhân khẩu
 */
export async function getNhanKhau(cccd) {
    const res = await fetch("/nhan-khau/" + cccd, {
        method: "GET"
    });
    return await res.json();
}
/**
 * Hàm lấy thông tin nhân khẩu dựa trên số CCCD
 * @param offset - Vị trí bắt đầu
 * @param limit - Số lượng nhân khẩu được lấy
 * @returns - Trả về danh sách nhân khẩu nếu thành công
 */
export async function getNhanKhauList(offset = 0, limit = 10) {
    const res = await fetch(`/nhan-khau?offset=${offset}&limit=${limit}`, {
        method: "GET"
    });
    return await res.json();
}
/**
 * Hàm thêm một nhân khẩu vào danh sách nhân khẩu
 * @param nhanKhau - Thông tin nhân khẩu
 * @returns
 */
export async function insertNhanKhau(nhanKhau) {
    const res = await fetch(`/nhan-khau`, {
        method: "POST",
        body: JSON.stringify(nhanKhau)
    });
    return await res.json();
}
/**
 * Hàm cập nhật thông tin một nhân khẩu trong danh sách nhân khẩu
 * @param nhanKhau - Thông tin nhân khẩu. Chỉ cập nhật các trường khác null | undefined
 * @returns
 */
export async function updateNhanKhau(nhanKhau) {
    const res = await fetch(`/nhan-khau`, {
        method: "PUT",
        body: JSON.stringify(nhanKhau)
    });
    return await res.json();
}
/**
 * Hàm xóa một nhân khẩu có số CCCD tương ứng khỏi danh sách nhân khẩu
 * @param cccd - Số CCCD của nhân khẩu
 * @returns
 */
export async function deleteNhanKhau(cccd) {
    const res = await fetch(`/nhan-khau/${cccd}`, {
        method: "DELETE",
    });
    return await res.json();
}
