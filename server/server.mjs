import express from "express"

import staticRouter from "./routers/static-router.mjs"
import loginRouter from "./routers/login-router.mjs"

const server = express();

server.use(express.static("./server/public"));
server.use(express.json());
server.use([staticRouter, loginRouter]);

server.use((req, res)=>{
    console.log(req.url);
})

server.listen(80, "::", ()=>{
    console.log("Server is listening");
});
