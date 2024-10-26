import express from 'express'
import { cadastrar, login, carregar } from '../controllers/Usuario.js'

const router = express.Router()

router.post('/', cadastrar)
router.post('/login', login)
router.get('/', carregar)

export default router
