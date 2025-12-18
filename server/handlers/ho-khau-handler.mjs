import { getHoKhau } from "../services/ho-khau/ho-khau";
export async function getHoKhauList(req, res) {
    let resData;
    const offset = Number(req.query.offset) || 0;
    const limit = Number(req.query.limit) || 10;
    const data = await getHoKhau(offset, limit);
    if (data == "ERROR") {
        resData = {
            type: "ERROR",
            message: "Server đang có lỗi vui lòng thử lại sau"
        };
        res.status(500);
    }
    else {
        resData = {
            type: "OK",
            data: data
        };
        res.status(200);
    }
    res.json(resData);
}
