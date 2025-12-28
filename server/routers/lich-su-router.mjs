import { Router } from "express";
import { getLichSuList, filterLichSu } from "../handlers/lich-su-handler.mjs";
const router = Router();
import { verifyUser } from "../handlers/login-handler.mjs";
router.use("/lich-su", verifyUser);
router.use("/lich-su/sort", filterLichSu);
router.get("/lich-su", getLichSuList);

export default router;
