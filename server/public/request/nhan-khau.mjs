/**
 * Hàm lấy thông tin nhân khẩu dựa trên số CCCD
 * @param cccd - Số CCCD của nhân khẩu
 * @returns
 */
export async function getNhanKhau(cccd) {
    const res = await fetch("/nhan-khau/" + cccd, {
        method: "GET"
    });
    return await res.json();
}
