/**
 * Request để lấy danh sách nộp tiền
 * @param offset - Vị trí bắt đầu để lấy danh sách nộp tiền - Mặc định là 0
 * @param limit - Số lượng hoá đơn được lấy, nếu là -1 thì lấy toàn bộ - Mặc định là 20
 * @returns - Nếu thành công thì data là mảng lưu trữ danh sách hoá đơn, ngược lại là message lỗi
 */
export async function getNopTienList(offset = 0, limit = 20,maKhoanThu) {
    const res = await fetch(`/nop-tien?offset=${offset}&limit=${limit}&maKhoanThu=${maKhoanThu}`, {
        method: "GET"
    });
    return await res.json();
}
/**
 * Request để lấy thông tin về hoá đơn theo ID
 * @param _id - ID của hoá đơn cần lấy
 * @returns - Thông tin về hoá đơn hoặc message lỗi
 */
export async function getNopTien(_id) {
    const res = await fetch(`/nop-tien/${_id}`, {
        method: "GET",
    });
    return await res.json();
}
/**
 * Request để thêm hoá đơn
 * @param nopTien - Thông tin về hoá đơn cần thêm
 */
export async function insertNopTien(nopTien) {
    const res = await fetch(`/nop-tien`, {
        method: "POST",
        body: JSON.stringify(nopTien),
        headers: {
            "content-type": "application/json"
        }
    });
    return await res.json();
}
/**
 * Request để cập nhật hoá đơn
 * @param nopTien - Chỉ cập nhật các thuộc tính khác null và undefined
 * @returns 
 */
export async function updateNopTien(nopTien) {
    const res = await fetch(`/nop-tien/${nopTien._id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(nopTien)
    });
    return await res.json();
}
/**
 * Request để xóa hoá đơn theo ID
 * @param _id - ID của hoá đơn cần xóa
 * @returns
 */
export async function deleteNopTien(_id) {
    const res = await fetch(`/nop-tien/${_id}`, {
        method: "DELETE"
    });
    return await res.json();
}