import { Router } from "express";
import { getNhanKhauList, getNhanKhau, insertNhanKhau, deleteNhanKhau, updateNhanKhau } from "../handlers/nhan-khau-handler.mjs";
const router = Router();

router.get("/nhan-khau", getNhanKhauList);
router.post("/nhan-khau", insertNhanKhau);
router.delete("/nhan-khau/:cccd", deleteNhanKhau);
router.put("/nhan-khau/:cccd", updateNhanKhau);
router.get("/nhan-khau/:cccd", getNhanKhau);

export default router;
