export class ServerResponse{
    /**@type {"OK" | "ERROR" | "REDIRECT" | "BAD REQUEST"} */
    type;
    /**@type {string} */
    message;
    /**@type {*} */
    data;
}