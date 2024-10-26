import express from 'express'
import {
  carregar,
  cadastrar,
  editar,
  eliminar,
  carregarPorUsuario,
} from '../controllers/Propriedade.js'

const router = express.Router()

router.get('/', carregar)
router.get('/:id', carregarPorUsuario)
router.post('/', cadastrar)
router.put('/:id', editar)
router.delete('/:id', eliminar)

export default router
