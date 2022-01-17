import express from "express"
import {buildSchema} from "type-graphql"
import {ApolloServer} from "apollo-server-express"
import {createConnection} from "typeorm"
import { createClient } from "redis"
import session from "express-session"
import connectRedis from "connect-redis"
import { MyGraphQLContext } from "./types"
import User from "./entities/User"
import UserResolver from "./resolvers/user"
import cors from "cors"

const main =async () => {

    // Initialize type orm db connection
    // @ts-ignore orm is declared but never used -.-
    const orm = await createConnection({
        type:"postgres",
        database: "usersignuptest1",
        username: "postgres",
        password: "postgres",
        logging: true,
        synchronize: true,
        entities: [User]
    })

    const app = express()

    app.use(
        /* '/', // I can apply the middleware to a specific route, but in this case I'll apply it to every single one. */
        cors({
            origin:"http://localhost:3000",
            credentials:true
        })
    )

    // Initialize redis connection for storing sessions
    const RedisStore = connectRedis(session)
    const redisClient = createClient()
    
    // Applying express middleware in a specific order. Session will run before everything else.
    app.use(
        session({
            name:"qid",
            store: new RedisStore({ client:redisClient, disableTouch:true }),
            cookie:{
                maxAge : 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
                sameSite: "lax", // csrf
                httpOnly: true, // no access from browser js
                secure: false, // cookie only works in https -> set true in production
            },
            secret:"kadfgkasfkasdofkapkdpofkkadfgkasfkasdofkapkdpofk",
            resave:false,
            saveUninitialized:false,
        })
    )

    // Apollo Server graphql middleware setup
    // Set "request.credentials" to "include" in apollo playground settings
    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [UserResolver],
            validate:false
        }),
        context: ({req, res}) : MyGraphQLContext => ({req, res})
    })
    apolloServer.applyMiddleware({
        app,
        cors: false
    })
    
    // Express app setup
    app.get("/", (_, res) => { res.send("Hello world! I'm alive!") })
    app.listen(5000., () => console.log("Express server started @ localhost:5000."))
}

main();