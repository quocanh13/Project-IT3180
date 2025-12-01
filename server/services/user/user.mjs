import User from "../../config/models/user-model.mjs";

/**
 * @param {string} username 
 * @param {string} password 
 * @returns {Promise<"OK" | "TÊN ĐĂNG NHẬP KHÔNG TỒN TẠI" | "MẬT KHẨU KHÔNG ĐÚNG" | "KHÔNG ĐÚNG ĐỊNH DẠNG" | "SERVER CÓ LỖI">}
 */
export async function login(username, password) {
    try {
        if(typeof username !== "string" || typeof password !== "string") {
            return "KHÔNG ĐÚNG ĐỊNH DẠNG";
        }
        const user = await User.findOne({ username: username });
        if(!user) {
            return "TÊN ĐĂNG NHẬP KHÔNG TỒN TẠI";
        }
        if(user.password !== password) {
            return "MẬT KHẨU KHÔNG ĐÚNG";
        }
        return "OK";
    } catch (error) {
        console.error("Login error:", error);
        return "SERVER CÓ LỖI";
    }
}

login();

