const express = require ('express')
const cors = require('cors')
const mongoose = require ('mongoose')
const app = express()
const dotenv = require("dotenv").config();

URI = process.env.MONGODB_URL

app.use(express.json())
app.use(cors())
console.log(process.env.MONGODB_URL)

const Filme = mongoose.model ("Filme", mongoose.Schema({
    titulo: {type: String},
    sinopse: {type: String}
}))

async function conectarAoMongoDB(){
    await
    mongoose.connect(URI)
}

let filmes = [
    {
    titulo: "Forrest Gump - O Contador de Histórias",
    sinopse: "Quarenta anos da história dos Estados Unidos, vistos pelos olhos de Forrest Gump (Tom Hanks), um rapaz com QI abaixo da média e boas intenções.",
    ano: 1984,
    classificacao: 5,
    },
    {
    titulo: "Um Sonho de Liberdade",
    sinopse: "Em 1946, Andy Dufresne (Tim Robbins), um jovem e bem sucedido banqueiro, tem a sua vida radicalmente modificada ao ser condenado por um crime que nunca cometeu, o homicídio de sua esposa e do amante dela",
    ano: 1990,
    classificacao: 3,
    }
]
    
app.listen(3000,()=>{
    try{
        conectarAoMongoDB()
        console.log("Conectado ao mongo")
    }catch(e){
        console.log('Erro',e)
    }
})
//GET http://localhost:3000/hey
app.get('/hey', (req, res) => {
    res.send('hey')
    })
    

app.get('/filmes', (req, res) => {
     res.json(filmes)
    })

    app.post("/filmes", async (req, res) => {
        //obtém os dados enviados pelo cliente
        const titulo = req.body.titulo
        const sinopse = req.body.sinopse
        //monta um objeto agrupando os dados. Ele representa um novo filme
        //a seguir, construímos um objeto Filme a partir do modelo do mongoose
        const filme = new Filme({titulo: titulo, sinopse: sinopse})
        //save salva o novo filme na base gerenciada pelo MongoDB
        await filme.save()
        const filmes = await Filme.find()
        res.json(filmes)
        })
        



