import {Request, Response} from "express"

export type MyGraphQLContext = {
    req : Request
    res : Response
}