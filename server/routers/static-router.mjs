import { Router } from "express";
import { getLogin } from "../handlers/static-handler.mjs";

const router = Router();

router.get(["/", "/login"], getLogin);

export default router;