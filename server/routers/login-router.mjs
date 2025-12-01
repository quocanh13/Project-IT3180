import { Router } from "express";
import { postLogin } from "../handlers/login-handler.mjs";

const router = Router();

router.post(["/auth/login"], postLogin);

export default router;