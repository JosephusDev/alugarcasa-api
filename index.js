import express from "express"
import cors from "cors"


const app = express();
app.use(cors())
app.use(express.json());


// Iniciar o servidor
const PORT = process.env.PORT || 8800;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
