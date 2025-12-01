/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export async function getLogin(req, res) {
    res.redirect("/login/login.html");
}