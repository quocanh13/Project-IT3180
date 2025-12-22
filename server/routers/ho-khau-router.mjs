import { Router } from "express";
import { getHoKhauList, getHoKhau, insertHoKhau, updateHoKhau, deleteHoKhau } from "../handlers/ho-khau-handler.mjs";
const router = Router();
router.get("/ho-khau", getHoKhauList);
router.post("/ho-khau", insertHoKhau);
router.get("/ho-khau/:chuHo", getHoKhau);
router.put("/ho-khau/:chuHo", updateHoKhau);
router.delete("/ho-khau/:chuHo", deleteHoKhau);
export default router;
