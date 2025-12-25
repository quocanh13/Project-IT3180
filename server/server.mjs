import express from "express"

import staticRouter from "./routers/static-router.mjs"
import loginRouter from "./routers/login-router.mjs"
import hoKhauRouter from "./routers/ho-khau-router.mjs"
import nhanKhauRouter from "./routers/nhan-khau-router.mjs"
import khoanThuRouter from "./routers/khoan-thu-router.mjs"
import nopTienRouter from "./routers/nop-tien-router.mjs"

const server = express();

server.use(express.static("./server/public"));
server.use(express.json());

server.use((req, res, next)=>{
    console.log(req.url + " " + req.method);
    next();
})

server.use([staticRouter, loginRouter, hoKhauRouter, nhanKhauRouter, khoanThuRouter, nopTienRouter]);

server.listen(80, "::", ()=>{
    console.log("Server is listening");
});
