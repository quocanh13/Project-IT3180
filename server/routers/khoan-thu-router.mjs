import { Router } from "express";
import { getKhoanThuList, getKhoanThu, insertKhoanThu, deleteKhoanThu, updateKhoanThu } from "../handlers/khoan-thu-handler.mjs";
const router = Router();

router.get("/khoan-thu", getKhoanThuList);
router.post("/khoan-thu", insertKhoanThu);
router.delete("/khoan-thu/:maKhoanThu", deleteKhoanThu);
router.put("/khoan-thu/:maKhoanThu", updateKhoanThu);
router.get("/khoan-thu/:maKhoanThu", getKhoanThu);
    
export default router;
