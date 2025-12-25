import { Router } from "express";
import { getHoKhauList, getHoKhau, addThanhVien, deleteThanhVien, insertHoKhau, deleteHoKhau, updateHoKhau } from "../handlers/ho-khau-handler.mjs";
import { verifyUser } from "../handlers/login-handler.mjs";
const router = Router();

router.use("/ho-khau", verifyUser)

router.get("/ho-khau", getHoKhauList);
router.post("/ho-khau", insertHoKhau);
router.delete("/ho-khau/:_id", deleteHoKhau);
router.put("/ho-khau/:_id", updateHoKhau);
router.get("/ho-khau/:_id", getHoKhau);
router.post("/ho-khau/:_id/thanh-vien/:thanhVien", addThanhVien);
router.delete("/ho-khau/:_id/thanh-vien/:thanhVien", deleteThanhVien);
export default router;
