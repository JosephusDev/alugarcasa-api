import express from 'express'
import {
  carregar,
  cadastrar,
  editar,
  eliminar,
  carregarPorUsuario,
} from '../controllers/Propriedade.js'
import { upload } from '../middleware/upload_supabase.js'

const router = express.Router()

router.get('/', carregar)
router.get('/:id', carregarPorUsuario)
router.post('/', upload.single('imagem'), cadastrar)
router.put('/:id', editar)
router.delete('/:id/:newFileName', eliminar)

export default router
