import { Router } from "express";
import { getLogin, getLanding } from "../handlers/static-handler.mjs";
const router = Router();
router.get(["/login"], getLogin);
router.get("/", getLanding);
export default router;
