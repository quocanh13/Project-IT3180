import { ServerResponse } from "../utils/data-types.mjs";

/**
 * @param {string} username 
 * @param {string} password 
 * @returns {Promise<ServerResponse>}
 */
export async function login(username, password) {
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