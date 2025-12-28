export async function getLichSuList(searchValue = null) {
    const url = searchValue ? `/lich-su?searchValue=${encodeURIComponent(searchValue)}` : `/lich-su`;
    const res = await fetch(url, { method: "GET" });
    const resData = await res.json();
    if (resData.type === "REDIRECT") {
        window.location.href = resData.redirectURL;
        return;
    }
    return resData;
}
export async function filterLichSu(status) {
    const res = await fetch(`/lich-su/sort?status=${status}`, { method: "GET" });
    const resData = await res.json();
    if (resData.type === "REDIRECT") {
        window.location.href = resData.redirectURL;
        return;
    }
    return resData;
}