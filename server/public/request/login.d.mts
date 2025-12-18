import { ServerResponse } from "../utils/data-types.mjs";
/**
 * Hàm gửi yêu cầu đăng nhập
 * @param username
 * @param password
 */
export declare function login(username: string, password: string): Promise<ServerResponse>;
