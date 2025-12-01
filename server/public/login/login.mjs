import { ServerResponse } from "../utils/data-types.mjs";

/**
 * @param {string} username 
 * @param {string} password 
 * @returns {Promise<ServerResponse>}
 */
async function login(username, password) {
    const res = await fetch(
        "/auth/login",
        {
            method : "POST",
            headers : {
                "Content-Type" : "application/json"
            },
            body : JSON.stringify({username, password})
        }
    );

    const resData = await res.json();
    return resData;
}

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