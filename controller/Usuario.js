import { pool } from "../config/database.js";
import ValidadorSenha from "senha-check";
import bcrypt from "bcryptjs";

const esquema = new ValidadorSenha();

esquema
    .min(4)
    .max(8)
    .temCaracteresEspeciais()
    .temMaiusculas(2)
    .temMinusculas()
    .sem().digitos()
    .sem().espaco();



export const cadastrar = async (req, res) => {
    const { nome, senha } = req.body;

    // Verificação se o nome e a senha foram fornecidos
    if (!nome || !senha) {
        return res.status(400).json({ message: "Informe todos os dados necessários (nome e senha)." });
    }

    // Validação da senha usando o esquema de validação
    if (!esquema.validar(senha)) {
        return res.status(400).json({ message: "Senha Inválida.", detalhes: esquema.validar(senha, { detalhes: true }) });
    }

    try {
        // Verifica se o nome de usuário já existe
        const [existingUser] = await pool.query('SELECT * FROM usuario WHERE nome = ?', [nome]);

        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'Nome de usuário já existe.' });
        }

        // Hash da senha com bcrypt
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(senha, saltRounds);

        // Inserir o usuário no banco de dados
        const [result] = await pool.query('INSERT INTO usuario (nome, senha) VALUES (?, ?)', [nome, hashedPassword]);

        // Retornar sucesso com o ID do usuário recém-cadastrado
        return res.status(201).json({ message: 'Usuário cadastrado com sucesso'});
    } catch (error) {
        console.error('Erro ao cadastrar usuário:', error);
        return res.status(500).json({ message: 'Erro ao cadastrar usuário.' });
    }
};





