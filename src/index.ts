import express from "express"



console.log("Hello world!")


const main =async () => {
    const app = express()
    
    app.get("/", (_, res) => {
        res.send("Hello world!")
    })

    app.listen(5000., () => console.log("Express server started @ localhost:5000."))
}

main();