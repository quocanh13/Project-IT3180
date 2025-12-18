import { Router } from "express";
import { getHoKhauList } from "../handlers/ho-khau-handler.mjs";
const router = Router();
router.get("/ho-khau", getHoKhauList);
export default router;
