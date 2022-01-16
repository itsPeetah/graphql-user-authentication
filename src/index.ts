import express from "express"
import {createConnection} from "typeorm"
import {buildSchema} from "type-graphql"
import User from "./schema/entities/User"
import UserResolver from "./schema/resolvers/user"

import {ApolloServer} from "apollo-server-express"

// import redis from "redis"
// import session from "express-session"
// import connectRedis from "connect-redis"

const main =async () => {

    const orm = await createConnection({
        type:"postgres",
        database: "usersignuptest1",
        username: "postgres",
        password: "postgres",
        logging: true,
        synchronize: true,
        entities: [User]
    })
    console.log("DB Connection:", orm.name)

    const app = express()

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [UserResolver],
            validate:false
        })
    })
    
    /*
    const RedisStore = connectRedis(session)
    const redisClient = redis.createClient()

    // Applying express middleware in a specific order.
    // Session will run before everything else.
    app.use(
        session({
            name:"qid",
            store: new RedisStore({
                client:redisClient,
                disableTouch:true,
            }),
            cookie:{
                maxAge : 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
                httpOnly: true,
                sameSite: "lax", // csrf
                secure: false, // cookie only works in https -> set true in production
            },
            secret:"kadfgkasfkasdofkapkdpofkkadfgkasfkasdofkapkdpofk",
            resave:false,
        })
    )
    */

    app.get("/", (_, res) => { res.send("Hello world! I'm alive!") })

    apolloServer.applyMiddleware({ app })

    app.listen(5000., () => console.log("Express server started @ localhost:5000."))
}

main();