import express from "express"
import {createConnection} from "typeorm"
import {graphqlHTTP} from "express-graphql"
import {buildSchema} from "type-graphql"
import User from "./schema/entities/User"
import UserResolver from "./schema/resolvers/user"

console.log("Hello world!")


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
    
    app.get("/", (_, res) => {
        res.send("I'm alive!")
    })
    app.use("/graphql", graphqlHTTP({
        graphiql:true,
        schema: await buildSchema({
            resolvers: [UserResolver],
            validate:false
        }),
        context:{ foo: "bar" }
    }))

    app.listen(5000., () => console.log("Express server started @ localhost:5000."))
}

main();