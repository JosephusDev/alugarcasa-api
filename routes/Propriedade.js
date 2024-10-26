import express from 'express'
import {
  carregar,
  cadastrar,
  editar,
  eliminar,
  carregarPorUsuario,
} from '../controllers/Propriedade.js'

const router = express.Router()
router.get('/carregar', carregar)
router.get('/carregarPorUsuario/:id', carregarPorUsuario)
router.post('/cadastrar', cadastrar)
router.put('/editar', editar)
router.delete('/eliminar/:id', eliminar)

export default router
