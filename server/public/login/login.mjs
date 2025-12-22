import { login } from "../request/login.mjs";

document.addEventListener('DOMContentLoaded', function() {
    const loginBtn = document.getElementById('loginBtn');

    loginBtn.addEventListener('click', loginEvent);
});

async function loginEvent() {
    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;

    // Kiểm tra rỗng
    if (!user || !pass) {
        alert("Vui lòng không để trống tên đăng nhập hoặc mật khẩu.");
        return;
    }

    const resData = await login(user, pass);
    console.log(resData);
    if(resData.type == "REDIRECT") {
        window.location.href = resData.redirectURL;
    }
}