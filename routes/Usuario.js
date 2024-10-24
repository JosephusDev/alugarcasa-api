import express from "express";
import { cadastrar, login, carregar } from "../controllers/Usuario.js";

const router = express.Router();


router.post("/cadastrar", cadastrar); // Para cadastro de usuário
router.post("/login", login);         // Para login de usuário
router.get("/carregar", carregar);   // Para teste apenas
export default router;
