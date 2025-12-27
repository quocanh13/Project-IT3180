export async function getLichSuList(canHo = null) {
    const url = canHo ? `/lich-su?canHo=${canHo}` : `/lich-su`;
    const res = await fetch(url, { method: "GET" });
    const resData = await res.json();
    if (resData.type === "REDIRECT") {
        window.location.href = resData.redirectURL;
        return;
    }
    return resData;
}