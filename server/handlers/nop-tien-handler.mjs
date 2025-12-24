import { getNopTienList as DBGetNopTienList, getNopTien as DBGetNopTien, insertNopTien as DBInsertNopTien, updateNopTien as DBUpdateNopTien, deleteNopTien as DBDeleteNopTien } from "../services/nop-tien/nop-tien.mjs";

export async function getNopTienList(req, res) {
    let resData;
    const offset = Number(req.query.offset) || 0;
    const limit = Number(req.query.limit) || 10;
    const data = await DBGetNopTienList(offset, limit, req.query.maKhoanThu || null);
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

export async function getNopTien(req, res) {
    let resData;
    const data = await DBGetNopTien(req.params.id);
    if (data == "ERROR") {
        resData = {
            type: "ERROR",
            message: "Server đang có lỗi vui lòng thử lại sau"
        };
        res.status(500);
    }
    else if (data == "HOÁ ĐƠN KHÔNG TỒN TẠI") {
        resData = {
            type: "NOT FOUND",
            message: "Hoá đơn không tồn tại"
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

export async function insertNopTien(req, res) {
    const nopTienData = req.body;
    const result = await DBInsertNopTien(nopTienData);
    let resData;
    if (result == "ERROR") {
        resData = {
            type: "ERROR",
            message: "Server đang có lỗi, vui lòng thử lại sau"
        };
        res.status(500);
    }
    else if (result == "ĐÃ NỘP TIỀN") {
        resData = {
            type: "BAD REQUEST",
            message: "Người nộp tiền đã nộp tiền cho khoản thu này"
        };
        res.status(400);
    }
    else {
        resData = {
            type: "OK",
            message: "Đã thêm hoá đơn thành công"
        };
        res.status(200);
    }
    res.json(resData);
}

export async function updateNopTien(req, res) {
    const nopTienData = req.body;
    const result = await DBUpdateNopTien(nopTienData);
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
            message: "Cập nhật hoá đơn thành công"
        };
        res.status(200);
    }
    else {
        resData = {
            type: "NOT FOUND",
            message: "Hoá đơn không tồn tại"
        };
        res.status(404);
    }
    res.json(resData);
}

export async function deleteNopTien(req, res) {
    const result = await DBDeleteNopTien(req.params.id);
    let resData;
    if (result == "ERROR") {
        resData = {
            type: "ERROR",
            message: "Server đang có lỗi, vui lòng thử lại sau"
        };
        res.status(500);
    }
    else if (result == "HOÁ ĐƠN KHÔNG TỒN TẠI") {
        resData = {
            type: "NOT FOUND",
            message: "Hoá đơn không tồn tại"
        };
        res.status(404);
    } else {
        resData = {
            type: "OK",
            message: "Xóa hoá đơn thành công"
        };
        res.status(200);
    }
    res.json(resData);
}
