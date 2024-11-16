import express from 'express'
import { VerificarToken } from '../controllers/VerifyToken.js'

const router = express.Router()

router.get('/', VerificarToken)

export default router
