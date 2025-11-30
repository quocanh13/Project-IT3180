export class ServerResponse{
    /**
     * @type {"OK" | "ERROR" | "REDIRECT" | "BAD REQUEST"} 
     * 
     * Kiểu của phản hồi 
     * 
     * OK - Request đã được xử lý thành công \n
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
    redirectURl;
}