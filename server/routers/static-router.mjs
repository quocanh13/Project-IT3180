import { Router } from "express";
import {getLanding, getLogin } from "../handlers/static-handler.mjs";

const router = Router();

router.get("/",getLanding);
router.get("/login", getLogin);

export default router;