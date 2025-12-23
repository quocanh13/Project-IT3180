export class ServerResponse {
    /**
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
     *
     * Thông điệp server gửi về cho client để thông báo về kết quả của request
     */
    message;
    /**
     *
     * Dữ liệu đi kèm nếu type là OK khi người dùng cần lấy dữ liệu
     */
    data;
    /**
     *
     * URL để điều hướng khi type = REDIRECT
     */
    redirectURL;
}
export class NhanKhau {
    cccd;
    hoTen;
    /**
     * True là nam, false là nữ
     */
    gioiTinh;
    /**@type {Date} */
    ngaySinh;
    danToc;
    quocTich;
    queQuan;
    noiSinh;
    /**
     * Số CCCD của chủ hộ
     */
    hoKhau;
    quanHeVoiChuHo;
}
export class HoKhau {
    chuHo;
    /**
     * Danh sách số CCCD của các thành viên
     */
    thanhVien;
    soNha;
    ngayDK;
}
export class KhoanThu {
    id;
    ten;
    soTien;
    moTa;
    hanNop;
    ngayNop;
}
export class DsKhoanThu {
    /**Số CCCD của chủ hộ */
    chuHo;
    khoanThu;
}
