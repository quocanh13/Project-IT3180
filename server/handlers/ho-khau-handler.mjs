import { getHoKhauList as DBGetHoKhauList, getHoKhau as DBGetHoKhau, insertHoKhau as DBInsertHoKhau, updateHoKhau as DBUpdateHoKhau, deleteHoKhau as DBDeleteHoKhau } from "../services/ho-khau/ho-khau.mjs";
export async function getHoKhauList(req, res) {
    let resData;
    const offset = Number(req.query.offset) || 0;
    const limit = Number(req.query.limit) || 10;
    const data = await DBGetHoKhauList(offset, limit);
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
export async function getHoKhau(req, res) {
    let resData;
    const offset = Number(req.query.offset) || 0;
    const limit = Number(req.query.limit) || 10;
    const data = await DBGetHoKhau(Number(req.params.chuHo));
    if (data == "ERROR") {
        resData = {
            type: "ERROR",
            message: "Server đang có lỗi vui lòng thử lại sau"
        };
        res.status(500);
    }
    else if (data == "HỘ KHẨU KHÔNG TỒN TẠI") {
        resData = {
            type: "NOT FOUND",
            message: "Hộ khẩu không tồn tại"
        };
        res.status(404);
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
export async function insertHoKhau(req, res) {
    const result = await DBInsertHoKhau(req.body);
    let resData;
    if (result == "ERROR") {
        resData = {
            type: "ERROR",
            message: "Server đang có lỗi, vui lòng thử lại sau"
        };
        res.status(500);
    }
    else if (result == "HỘ ĐÃ TỒN TẠI") {
        resData = {
            type: "BAD REQUEST",
            message: "Hộ đã tồn tại"
        };
        res.status(400);
    }
    else {
        resData = {
            type: "OK",
            message: "Đã thêm hộ thành công"
        };
        res.status(200);
    }
    res.json(resData);
}
export async function updateHoKhau(req, res) {
    const result = await DBUpdateHoKhau(req.body);
    let resData;
    if (result == "ERROR") {
        resData = {
            type: "ERROR",
            message: "Server đang có lỗi, vui lòng thử lại sau"
        };
        res.status(500);
    }
    else if (result == "OK") {
        resData = {
            type: "OK",
            message: "Cập nhật hộ thành công"
        };
        res.status(200);
    }
    else {
        resData = {
            type: "NOT FOUND",
            message: "Hộ không tồn tại"
        };
        res.status(404);
    }
    res.json(resData);
}
export async function deleteHoKhau(req, res) {
    let resData;
    const chuHo = Number(req.params.chuHo);
    if (chuHo <= 0 || Number.isNaN(chuHo)) {
        resData = {
            type: "BAD REQUEST",
            message: "Số CCCD của chủ hộ không hợp lệ"
        };
        res.status(400);
    }
    else {
        const result = await DBDeleteHoKhau(chuHo);
        if (result == "ERROR") {
            resData = {
                type: "ERROR",
                message: "Server đang có lỗi, vui lòng thử lại sau"
            };
            res.status(500);
        }
        else if (result == "OK") {
            resData = {
                type: "OK",
                message: "Cập nhật hộ thành công"
            };
            res.status(200);
        }
        else {
            resData = {
                type: "NOT FOUND",
                message: "Hộ không tồn tại"
            };
            res.status(404);
        }
    }
    res.json(resData);
}
