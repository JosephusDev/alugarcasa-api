import { pool } from '../config/database.js'
import ValidadorSenha from 'senha-check'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const esquema = new ValidadorSenha()

esquema
  .min(4)
  .max(8)
  .temCaracteresEspeciais()
  .temMinusculas()
  .sem()
  .digitos()
  .sem()
  .espaco()

export const cadastrar = async (req, res) => {
  const { nome, senha } = req.body

  // Verificação se o nome e a senha foram fornecidos
  if (!nome || !senha) {
    return res
      .status(201)
      .json({ message: 'Informe todos os dados necessários (nome e senha).' })
  }

  // Validação da senha usando o esquema de validação
  if (!esquema.validar(senha)) {
    return res.status(200).json({
      detalhes: esquema.validar(senha, { detalhes: true }),
    })
  }

  try {
    // Hash da senha com bcrypt
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(senha, saltRounds)

    // Inserir o usuário no banco de dados
    await pool.query('INSERT INTO usuario (nome, senha) VALUES (?, ?)', [
      nome,
      hashedPassword,
    ])

    // Retornar sucesso com o ID do usuário recém-cadastrado
    return res.status(200).json({ message: 'Usuário cadastrado com sucesso' })
  } catch (error) {
    console.error('Erro ao cadastrar usuário:', error)
    return res
      .status(500)
      .json({ message: 'Erro ao cadastrar usuário.', error: error.message })
  }
}

export const login = async (req, res) => {
  const { nome, senha } = req.body

  // Verificar se ambos os campos foram fornecidos
  if (!nome || !senha) {
    return res.status(400).json({ message: 'Informe o nome e a senha.' })
  }

  try {
    // Verificar se o usuário com o nome fornecido existe
    const [user] = await pool.query('SELECT * FROM usuario WHERE nome = ?', [
      nome,
    ])

    if (user.length === 0) {
      return res.status(204).json({ message: 'Usuário não encontrado.' })
    }

    const usuario = user[0]

    // Comparar a senha fornecida com o hash da senha armazenada
    const senhaValida = await bcrypt.compare(senha, usuario.senha)

    if (!senhaValida) {
      return res.status(200).json({ message: 'Senha incorreta.' })
    }

    // Gerar o JWT
    const token = jwt.sign({ id: usuario.id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    })

    // Retornar Usuario com sucesso do login
    return res.json({
      id: usuario.id,
      nome: usuario.nome,
      token,
    })
  } catch (error) {
    console.error('Erro ao fazer login:', error)
    return res.status(500).json({ message: error })
  }
}

//Apenas para esta testes
export const carregar = async (req, res) => {
  const [usuarios] = await pool.query('SELECT * FROM usuario')

  if (usuarios.length === 0) {
    return res.status(204).json({ Message: 'Nenhum usuario' })
  }

  return res.status(200).json(usuarios)
}

export const editar = async (req, res) => {
  const { nome, senha } = req.body
  const id = req.params.id

  try {
    // Se senha estiver presente, validar e fazer hash
    let hashedPassword = null
    if (senha) {
      // Validação da senha usando o esquema de validação
      const senhaValida = esquema.validar(senha)
      if (!senhaValida) {
        return res.status(400).json({
          detalhes: esquema.validar(senha, { detalhes: true }),
        })
      }
      // Hash da senha
      const saltRounds = 10
      hashedPassword = await bcrypt.hash(senha, saltRounds)
    }

    // Lógica de atualização
    if (nome && senha) {
      // Atualizar nome e senha
      await pool.query('UPDATE usuario SET nome = ?, senha = ? WHERE id = ?', [
        nome,
        hashedPassword,
        id,
      ])
    } else if (nome) {
      // Atualizar apenas o nome
      await pool.query('UPDATE usuario SET nome = ? WHERE id = ?', [nome, id])
    } else if (senha) {
      // Atualizar apenas a senha
      await pool.query('UPDATE usuario SET senha = ? WHERE id = ?', [
        hashedPassword,
        id,
      ])
    } else {
      return res.status(400).json({
        message: 'Nenhum campo fornecido para atualização.',
      })
    }

    return res.status(200).json({ message: 'Perfil atualizado com sucesso' })
  } catch (error) {
    console.error('Erro ao atualizar Perfil:', error)
    return res
      .status(500)
      .json({ message: 'Erro ao atualizar Perfil.', error: error.message })
  }
}
