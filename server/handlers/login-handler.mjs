import { login } from "../services/user/user.mjs";
import { sign } from "../utils/jwt.mjs";
export async function postLogin(req, res) {
    const result = await login(req.body.username, req.body.password);
    let resData;
    if (result == "OK") {
        const token = sign({ username: req.body.username }, "1h");
        res.cookie("token", token);
        resData = {
            type: "REDIRECT",
            redirectURL: "/ho-khau/ho-khau.html"
        };
        res.status(200);
    }
    else if (result == "TÊN ĐĂNG NHẬP KHÔNG TỒN TẠI") {
        resData = {
            type: "BAD REQUEST",
            message: "Tên đăng nhập không tồn tại"
        };
        res.status(400);
    }
    else if (result == "KHÔNG ĐÚNG ĐỊNH DẠNG") {
        resData = {
            type: "BAD REQUEST",
            message: "Tên đăng nhập và mật khẩu chỉ được chứa chữ cái không dấu (a-z A-Z) và chữ số 0-9"
        };
        res.status(400);
    }
    else if (result == "MẬT KHẨU KHÔNG ĐÚNG") {
        resData = {
            type: "BAD REQUEST",
            message: "Mật khẩu của bạn không đúng"
        };
        res.status(400);
    }
    else {
        resData = {
            type: "ERROR",
            message: "Server đang có lỗi vui lòng thử lại sau"
        };
        res.status(400);
    }
    res.json(resData);
}
