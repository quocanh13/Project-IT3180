export declare class ServerResponse {
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
    type: "OK" | "ERROR" | "REDIRECT" | "BAD REQUEST";
    /**
     *
     * Thông điệp server gửi về cho client để thông báo về kết quả của request
     */
    message: string;
    /**
     *
     * Dữ liệu đi kèm nếu type là OK khi người dùng cần lấy dữ liệu
     */
    data: any;
    /**
     *
     * URL để điều hướng khi type = REDIRECT
     */
    redirectURL: string;
}
export declare class NhanKhau {
    cccd: number;
    hoTen: string;
    /**
     * True là nam, false là nữ
     */
    gioiTinh: boolean;
    /**@type {Date} */
    ngaySinh: string;
    danToc: string;
    quocTich: string;
    queQuan: string;
    noiSinh: string;
    /**
     * Số CCCD của chủ hộ
     */
    hoKhau: number;
    quanHeVoiChuHo: string;
}
export declare class HoKhau {
    chuHo: string;
    /**
     * Danh sách số CCCD của các thành viên
     */
    thanhVien: number[];
    soNha: string;
    ngayDK: Date;
}
