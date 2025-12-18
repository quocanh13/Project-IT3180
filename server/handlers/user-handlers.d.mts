import { Response, NextFunction } from "express";
import { VerifiedRequest } from "../utils/types";
export declare function verifyUser(req: VerifiedRequest, res: Response, next: NextFunction): void;
