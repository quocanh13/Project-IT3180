import { Router } from "express";
import { getNhanKhauList, getNhanKhau, insertNhanKhau, deleteNhanKhau, updateNhanKhau, searchNhanKhau } from "../handlers/nhan-khau-handler.mjs";
import { verifyUser } from "../handlers/login-handler.mjs";
const router = Router();

router.use("/nhan-khau", verifyUser)

router.get("/nhan-khau", getNhanKhauList);
router.get("/nhan-khau/search",searchNhanKhau);
router.post("/nhan-khau", insertNhanKhau);
router.delete("/nhan-khau/:cccd", deleteNhanKhau);
router.put("/nhan-khau/:cccd", updateNhanKhau);
router.get("/nhan-khau/:cccd", getNhanKhau);

export default router;
