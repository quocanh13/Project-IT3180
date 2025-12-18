import User from "../../config/models/user-model.mjs";

/**
 * @param {string} username 
 * @param {string} password 
 * @returns {Promise<"OK" | "TÊN ĐĂNG NHẬP KHÔNG TỒN TẠI" | "MẬT KHẨU KHÔNG ĐÚNG" | "SERVER CÓ LỖI" | "KHÔNG ĐÚNG ĐỊNH DẠNG">}
 */
export async function login(username, password) {
    try {
        const user = await User.findOne({username : username})
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
