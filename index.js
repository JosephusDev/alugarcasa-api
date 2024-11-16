import express from 'express'
import cors from 'cors'
import rotaUsuario from './routes/Usuario.js'
import rotaPropriedade from './routes/Propriedade.js'
import rotaVerifyToken from './routes/VerifyToken.js'
import { autenticarToken } from './middleware/autenticacao.js'

const app = express()
app.use(cors())
app.use(express.json())

//Rotas públicas
app.use('/usuario', rotaUsuario)
app.use('/verify-token', rotaVerifyToken)

//Middleware para verificar token JWT

app.use(autenticarToken)

//Rotas privadas
app.use('/propriedade', rotaPropriedade)

// Iniciar o servidor
const PORT = process.env.PORT || 8800
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`)
})
