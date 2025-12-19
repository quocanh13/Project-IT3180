import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";
/**
 * Mở rộng Request - Xác thực token của người dùng
 */
export interface VerifiedRequest extends Request {
    /**
     * Thêm userInformation khi token của người dùng là hợp lệ - Chứa username
     */
    userInformation?: JwtPayload;
}
