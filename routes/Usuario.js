import express from "express";
import {cadastrar, login} from "../controller/Usuario.js";

const router = express.Router();
router.post("/", cadastrar);
router.get("/", login)


export default router;