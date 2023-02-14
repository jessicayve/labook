import express, { Request, Response } from 'express'
import cors from 'cors'
import { postRouter } from './routers/postRouter'


const app = express()

app.use(cors())
app.use(express.json())

app.listen(3003, () => {
    console.log(`Servidor rodando na porta ${3003}`)
})

app.use("/posts", postsRouter)





