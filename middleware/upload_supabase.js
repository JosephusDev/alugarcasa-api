import multer from 'multer'
import path from 'path'

// Configuração de armazenamento do Multer
const storage = multer.memoryStorage() // Usamos memoryStorage para não salvar no disco

// Função de filtro para aceitar apenas arquivos de imagem e pdf
const fileFilter = (req, file, cb) => {
  const fileTypes = /jpeg|jpg|png|gif/
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase())
  const mimetype = fileTypes.test(file.mimetype)

  if (mimetype && extname) {
    return cb(null, true)
  } else {
    cb('Error: Somente arquivos de imagem e pdfs são permitidos!')
  }
}

// Inicializa o Multer
const upload = multer({
  storage: storage, // Armazena em memória
  limits: { fileSize: 1024 * 1024 * 5 }, // Limite de tamanho do arquivo em 5MB
  fileFilter: fileFilter,
})

export { upload }
