import { verify } from "../utils/jwt";
export function verifyUser(req, res, next) {
    const token = verify(req.cookies.token);
    let resData;
    if (token == "ERROR") {
        resData = {
            type: "REDIRECT",
            message: "Token của bạn đã hết hạn vui lòng quay lại trang đăng nhập",
            redirectURL: "/login/login.html"
        };
    }
    else {
        req.userInformation = token;
        next();
    }
}
