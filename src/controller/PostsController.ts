import { Request, Response } from "express"
import { PostBusiness } from "../business/PostBusiness"
import { BaseError } from "../error/BaseError"


export class PostController{
    constructor(
        private postBusiness: PostBusiness
    ){}

    public getPosts = async (req: Request, res: Response) => {
        try {
            const q = req.query.q as string | undefined
    
            const output = await this.postBusiness.getPosts(q)
        
            res.status(200).send(output)
    
        } catch (error) {
            console.log(error)
    
            if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.send("Erro inesperado")
            }
        }
    }

    public createPost = async (req: Request, res: Response) => {
        try {
    
            const input = {
                id: req.body.id,
                creatorId: req.body.creatorId,
                content: req.body.content
            }

            const output = await this.postBusiness.createPost(input)
           
            res.status(201).send(output)

        } catch (error) {
            console.log(error)
    
            if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.send("Erro inesperado")
            }
        }
    }

    public editPost = async (req: Request, res: Response) => {
        try {
            
            const input = {
                idToEdit: req.params.id,
                content: req.body.content
            }
            
            const output = await this.postBusiness.editPost(input)
    
                res.status(201).send(output)            

        } catch (error) {
            console.log(error)
    
            if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.send("Erro inesperado")
            }
        }
    }

    public deletePost = async (req: Request, res: Response) => {
        try {
            const id = req.params.id
    
            const output = await this.postBusiness.deletePost(id)
            console.log(output)
            res.status(200).send(output)
    
        } catch (error) {
            console.log(error)
    
            if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.send("Erro inesperado")
            }
        }
    }
}