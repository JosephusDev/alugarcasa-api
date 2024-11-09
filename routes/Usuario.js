import express from 'express'
import { cadastrar, login, carregar, editar } from '../controllers/Usuario.js'

const router = express.Router()

router.post('/', cadastrar)
router.post('/login', login)
router.get('/', carregar)
router.put('/editar/:id', editar)

export default router
