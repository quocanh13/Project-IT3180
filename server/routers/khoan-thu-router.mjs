import { Router } from "express";
import { getKhoanThuList, getKhoanThu, insertKhoanThu, deleteKhoanThu, updateKhoanThu } from "../handlers/khoan-thu-handler.mjs";
const router = Router();
import { verifyUser } from "../handlers/login-handler.mjs";
router.use("/khoan-thu", verifyUser)

router.get("/khoan-thu", getKhoanThuList);
router.post("/khoan-thu", insertKhoanThu);
router.delete("/khoan-thu/:maKhoanThu", deleteKhoanThu);
router.put("/khoan-thu/:maKhoanThu", updateKhoanThu);
router.get("/khoan-thu/:maKhoanThu", getKhoanThu);
    
export default router;
