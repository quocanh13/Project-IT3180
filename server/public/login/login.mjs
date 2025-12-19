import { login } from "../request/login.mjs";
import { getHoKhauList } from "../request/ho-khau.mjs";

const form = document.querySelector("form");
const button = document.querySelector("button");

button.addEventListener("click", async ()=>{
    const formData = new FormData(form);
    const username = formData.get("username");
    const password = formData.get("password");

    const resData = await login(username, password);

    if(resData.type == "OK") {
        console.log("abc");
    } else {
        console.log(resData.message);
    }
});

