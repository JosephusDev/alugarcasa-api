import { pool } from '../config/database.js'
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

const uploadToSupabase = async (file) => {
  const { originalname, buffer, mimetype } = file
  const filePath = Date.now().toString()
  const { data, error } = await supabase.storage
    .from('meu-kubico')
    .upload(filePath, buffer, {
      contentType: mimetype,
    })
  if (error) {
    throw new Error(`Erro ao fazer upload para Supabase: ${error.message}`)
  }

  const { data: dados } = supabase.storage
    .from('meu-kubico')
    .getPublicUrl(filePath)
  return dados.publicUrl
}

const deleteToSupabase = async (text) => {
  const { data, error } = await supabase.storage
    .from('meu-kubico')
    .remove([text])
  if (error) {
    console.log(error)
  }
  return data
}

//CARREGAR TODAS AS PROPRIEDADES CADASTRADAS
export const carregar = async (req, res) => {
  try {
    //Query para selecionar todas as propriedades
    const [propriedades] = await pool.query(
      'select p.*, u.contato from propriedade p, usuario u where p.id_usuario = u.id',
    )

    //Verificar se não exite nenhuma propriedade cadastrada e retornar a mensagem
    if (propriedades.length === 0) {
      return res.status(204).json({ Message: 'Nenhuma propriedade encontrada' })
    }
    //Retornar todas as propriedades selecionadas
    return res.status(200).json(propriedades)
  } catch (error) {
    //Retornar Mensagem de erro
    return res
      .status(500)
      .json({ message: 'Erro ao carregar propriedades', Erro: error })
  }
}

//CARREGAR TODAS AS PROPRIEDADES CADASTRADAS DE UM USUARIO
export const carregarPorUsuario = async (req, res) => {
  //Pegar o ID do usuario
  const id = req.params.id

  try {
    //Query para selecionar todas as propriedades
    const [propriedades] = await pool.query(
      'SELECT * FROM propriedade WHERE id_usuario = ?',
      [id],
    )

    //Verificar se não exite nenhuma propriedade cadastrada e retornar a mensagem
    if (propriedades.length === 0) {
      return res
        .status(200)
        .json({ Message: 'Nenhuma propriedade do usuario encontrada' })
    }
    //Retornar todas as propriedades selecionadas
    return res.status(200).json(propriedades)
  } catch (error) {
    //Retornar Mensagem de erro
    return res.status(500).json({
      message: 'Erro ao carregar propriedades do usuário',
      Erro: error,
    })
  }
}

export const cadastrar = async (req, res) => {
  //Pegar os campos enviados
  const { descricao, cidade, bairro, preco, id_usuario } = req.body
  //Faça a validação dos campo no FRONT
  try {
    const file = req.file
    if (!file) {
      return res.status(200).json({ message: 'Nenhuma imagem enviada!' })
    }
    const fileUrl = await uploadToSupabase(file)
    //Fazer o insert dos dados
    await pool.query(
      'INSERT INTO propriedade(descricao, cidade, bairro, preco, imagem, id_usuario) VALUES ( ?, ?, ?, ?, ?, ? )',
      [descricao, cidade, bairro, preco, fileUrl, id_usuario],
    )
    //Retornar uma mensagem caso esteja tudo certo
    return res
      .status(200)
      .json({ message: 'Propriedade cadastrada com sucesso!' })
  } catch (error) {
    //Retornar Mensagem de erro
    return res
      .status(500)
      .json({ message: 'Erro ao Cadastrar propriedade', Erro: error.message })
  }
}

export const editar = async (req, res) => {
  //Pegar os campos enviados
  const { descricao, cidade, bairro, preco, imagem } = req.body
  const id = req.params.id
  try {
    //Fazer a atualizacao dos dados
    await pool.query(
      'UPDATE propriedade SET descricao = ?, cidade = ?, bairro = ?, preco = ?, imagem = ? WHERE id = ? ',
      [descricao, cidade, bairro, preco, imagem, id],
    )
    //Retornar uma mensagem caso esteja tudo certo
    return res
      .status(200)
      .json({ message: 'Propriedade atualizada com sucesso!' })
  } catch (error) {
    //Retornar mensagem de erro! Bombo molhou :) ;)
    return res
      .status(500)
      .json({ message: 'Erro ao Cadastrar propriedade', Erro: error })
  }
}

export const eliminar = async (req, res) => {
  const { id, newFileName } = req.params
  try {
    const resultado = await deleteToSupabase(newFileName)
    //Fazer a exclusao da propriedade
    if (resultado.length === 0) {
      await pool.query('DELETE FROM propriedade WHERE id = ?', [id])
      //Retornar uma mensagem caso esteja tudo certo
      return res
        .status(200)
        .json({ message: 'Propriedade eliminada com sucesso!' })
    } else {
      //Retornar mensagem de erro! Bombo molhou :) ;)
      return res
        .status(500)
        .json({ message: 'Erro ao eliminar a propriedade!' })
    }
  } catch (error) {
    //Retornar mensagem de erro! Bombo molhou :) ;)
    return res
      .status(500)
      .json({ message: 'Erro ao eliminar a propriedade!', erro: error.message })
  }
}
