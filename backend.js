const express = require ('express')
const cors = require('cors')
const app = express()
const mongoose = require("mongoose")
const uniqueValidator = require('mongoose-unique-validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require("dotenv").config()
URI = process.env.MONGODB_URL
app.use(express.json())
app.use(cors())

const Filme = mongoose.model ("Filme", mongoose.Schema({
        titulo: {type: String},
        sinopse: {type: String},
        ano: {type: Number},
        classificacao: {type: Number}
    }
))

const usuarioSchema = mongoose.Schema({
    login: {type: String, required: true, unique: true},
    password: {type: String, required: true}
})
usuarioSchema.plugin(uniqueValidator)
const Usuario = mongoose.model("Usuario", usuarioSchema)

async function conectarAoMongoDB() {
    await mongoose.connect(URI)
}    

//GET http://localhost:3000/hey
app.get('/hey', (req, res) => {
    res.send('hey')
    })
    

app.get('/filmes', async (req, res) => {
     const filmes = await Filme.find()
     res.json(filmes)     
    })

app.post("/filmes", async (req, res) => {
        //obtém os dados enviados pelo cliente
     const titulo = req.body.titulo
     const sinopse = req.body.sinopse
     const ano = req.body.ano
     const classificacao = req.body.classificacao

     //monta um objeto agrupando os dados. Ele representa um novo filme
     const filme = new Filme({titulo: titulo, sinopse: sinopse, ano: ano, classificacao: classificacao})
     //adiciona o novo filme à base
     await filme.save()
     //responde ao cliente. Aqui, optamos por devolver a base inteira ao cliente, embora não seja obrigatório.
     const filmes = await Filme.find()
     res.json(filmes)
})
        
app.post('/signup', async (req, res) => {
    try {
        const login = req.body.login
        const password = req.body.password
        const criptografada = await bcrypt.hash(password, 10)
        const usuario = new Usuario({
            login: login,
            password: criptografada
        })
        const respMongo = await usuario.save()
        console.log(respMongo)
        res.end()    
    } catch (error) {
        console.log(error)
        res.status(409).send('Erro')
    }
})


app.post('/login', async (req, res) => {
    //login/senha que o usuário enviou
    const login = req.body.login
    const password = req.body.password
    //tentamos encontrar no MongoDB
    const u = await Usuario.findOne({login: req.body.login})
    if(!u){
        //senão foi encontrado, encerra por aqui com código 401
        return res.status(401).json({mensagem: "login inválido"})
    }
    //se foi encontrado, comparamos a senha, após descriptográ-la
    const senhaValida = await bcrypt.compare(password, u.password)
    if (!senhaValida){
        return res.status(401).json({mensagem: "senha inválida"})
    }
    //aqui vamos gerar o token e devolver para o cliente
    const token = jwt.sign(
        {login: login},
        //depois vamos mudar para uma chave secreta de verdade
        "chave-secreta",
        {expiresIn: "1h"}
    )
    res.status(200).json({token: token})
    })
    




app.listen(3000, () => {
    try{
        conectarAoMongoDB()
        console.log("up and running")
    }
    catch (e){
        console.log('Erro', e)
    }
})
    
