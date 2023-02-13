import express, { Request, Response } from "express"
import knex from "knex"
import { PostsController } from "../controller/PostsController"

export const postsRouter = express.Router()


const postsController = new PostsController()

postsRouter.get('/', postsController.getPosts )