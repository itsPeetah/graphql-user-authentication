import {Request, Response} from "express"
import { SessionData } from "express-session"

export type MyGraphQLContext = {
    req : Request & {session : SessionData & {userId?: number} } // session might be undefined on req, userId might be undefined on session (set with cookie)
    res : Response
}