import { Response, NextFunction } from "express";
import { VerifiedRequest } from "../utils/types.mjs";
export declare function verifyUser(req: VerifiedRequest, res: Response, next: NextFunction): void;
