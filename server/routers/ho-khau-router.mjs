import { Router } from "express";
import { getHoKhauList, getHoKhau } from "../handlers/ho-khau-handler.mjs";
const router = Router();
router.get("/ho-khau", getHoKhauList);
router.get("/ho-khau/:chuHo", getHoKhau);
export default router;
