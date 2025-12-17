export class ServerResponse{
    /**
     * @type {"OK" | "ERROR" | "REDIRECT" | "BAD REQUEST"} 
     * 
     * Kiểu của phản hồi 
     * 
     * OK - Request đã được xử lý thành công 
     * 
     * ERROR - Có lỗi nào đó ở server
     * 
     * REDIRECT - Yêu cầu client điều hướng theo redirectURL
     * 
     * BAD REQUEST - Thông tin mà client gửi lên server không hợp lệ
     */
    type;

    /**
     * @type {string} 
     * 
     * Thông điệp server gửi về cho client để thông báo về kết quả của request
     */
    message;
    
    /**
     * @type {*} 
     * 
     * Dữ liệu đi kèm nếu type là OK khi người dùng cần lấy dữ liệu 
     */
    data;

    /**
     * @type {string} 
     * 
     * URL để điều hướng khi type = REDIRECT
     */
    redirectURL;
}

export class NhanKhau {
    /**@type {number} */
    cccd;

    /**@type {string} */
    hoTen;

    /**
     * @type {boolean} 
     * 
     * True là nam, false là nữ
     */
    gioiTinh;

    /**@type {Date} */
    ngaySinh;

    /**@type {string} */
    danToc;

    /**@type {string} */
    quocTich;

    /**@type {string} */
    queQuan;

    /**@type {string} */
    noiSinh;

    /**@type {number} */
    hoKhau;

    /**@type {string} */
    quanHeVoiChuHo;
}