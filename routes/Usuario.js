import express from "express";
import {cadastrar, carregar} from "../controller/Usuario.js";

const router = express.Router();
router.post("/", cadastrar);


export default router;