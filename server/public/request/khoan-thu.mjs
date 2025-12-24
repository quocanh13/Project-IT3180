/**
 * Request để lấy danh sách khoản thu 
 * @param offset - Vị trí bắt đầu để lấy danh sách khoản thu - Mặc định là 0
 * @param limit - Số lượng khoản thu được lấy, nếu là -1 thì lấy toàn bộ - Mặc định là 20
 * @returns - Nếu thành công thì data là mảng lưu trữ danh sách mã khoản thu, ngược lại là message lỗi
 */
export async function getKhoanThuList(offset = 0, limit = 20) {
    const res = await fetch(`/khoan-thu?offset=${offset}&limit=${limit}`, {
        method: "GET"
    });
    return await res.json();
}
/**
 * Request để lấy thông tin về khoản thu
 * @param _id - ID của khoản thu
 * @returns - Thông tin về khoản thu hoặc message lỗi
 */
export async function getKhoanThu(_id) {
    const res = await fetch(`/khoan-thu/${_id}`, {
        method: "GET",
    });
    return await res.json();
}
/**
 * Request để thêm hộ khẩu
 * @param khoanThu - Thông tin về khoản thu cần thêm
 */
export async function insertKhoanThu(khoanThu) {
    const res = await fetch(`/khoan-thu`, {
        method: "POST",
        body: JSON.stringify(khoanThu),
        headers: {
            "content-type": "application/json"
        }
    });
    return await res.json();
}
/**
 * Request để cập nhật hộ khẩu
 * @param khoanThu - Chỉ cập nhật các thuộc tính khác null và undefined
 * @returns 
 */
export async function updateKhoanThu(khoanThu) {
    const res = await fetch(`/khoan-thu/${khoanThu._id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(khoanThu)
    });
    return await res.json();
}
/**
 * Request để xóa khoản thu
 * @param _id - ID của khoản thu cần xóa
 * @returns
 */
export async function deleteKhoanThu(_id) {
    const res = await fetch(`/khoan-thu/${_id}`, {
        method: "DELETE"
    });
    return await res.json();
}