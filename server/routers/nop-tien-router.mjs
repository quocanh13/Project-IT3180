import { Router } from "express";
import { getNopTienList, getNopTien, insertNopTien, deleteNopTien, updateNopTien } from "../handlers/nop-tien-handler.mjs";
import { verifyUser } from "../handlers/login-handler.mjs";
const router = Router();

router.use("/nop-tien", verifyUser)

router.get("/nop-tien", getNopTienList);
router.post("/nop-tien", insertNopTien);
router.delete("/nop-tien/:id", deleteNopTien);
router.put("/nop-tien/:id", updateNopTien);
router.get("/nop-tien/:id", getNopTien);

export default router;
