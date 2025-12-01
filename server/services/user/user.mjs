import User from "../../config/models/user-model.mjs";

/**
 * @param {string} username 
 * @param {string} password 
 * @returns {Promise<"OK" | "TÊN ĐĂNG NHẬP KHÔNG TỒN TẠI" | "MẬT KHẨU KHÔNG ĐÚNG" | "KHÔNG ĐÚNG ĐỊNH DẠNG" | "SERVER CÓ LỖI">}
 */
export async function login(username, password) {
    const res = await User.findOne({
        username : "quocanh1234",
        password : "quocanh"
    });
    console.log(res);
}

login();

