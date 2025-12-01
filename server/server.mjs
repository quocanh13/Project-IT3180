import express from "express"

import staticRouter from "./routers/static-router.mjs"

const server = express();

server.use(express.static("public"));
server.use(express.json());
server.use([staticRouter]);

server.listen(80, "::", ()=>{
    console.log("Server is listening");
})
