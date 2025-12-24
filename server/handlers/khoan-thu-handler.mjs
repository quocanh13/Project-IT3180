import { getKhoanThuList as DBGetKhoanThuList, getKhoanThu as DBGetKhoanThu, insertKhoanThu as DBInsertKhoanThu, updateKhoanThu as DBUpdateKhoanThu, deleteKhoanThu as DBDeleteKhoanThu } from "../services/khoan-thu/khoan-thu.mjs";

export async function getKhoanThuList(req, res) {
    let resData;
    const offset = Number(req.query.offset) || 0;
    const limit = Number(req.query.limit) || 10;
    const data = await DBGetKhoanThuList(offset, limit);
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

export async function getKhoanThu(req, res) {
    let resData;
    const data = await DBGetKhoanThu(req.params.maKhoanThu);
    if (data == "ERROR") {
        resData = {
            type: "ERROR",
            message: "Server đang có lỗi vui lòng thử lại sau"
        };
        res.status(500);
    }
    else if (data == "KHOẢN THU KHÔNG TỒN TẠI") {
        resData = {
            type: "NOT FOUND",
            message: "Khoản thu không tồn tại"
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

export async function insertKhoanThu(req, res) {
    const khoanThuData = req.body;
    const result = await DBInsertKhoanThu(khoanThuData);
    let resData;
    if (result == "ERROR") {
        resData = {
            type: "ERROR",
            message: "Server đang có lỗi, vui lòng thử lại sau"
        };
        res.status(500);
    }
    else if (result == "KHOẢN THU ĐÃ TỒN TẠI") {
        resData = {
            type: "BAD REQUEST",
            message: "Khoản thu đã tồn tại"
        };
        res.status(400);
    }
    else {
        resData = {
            type: "OK",
            message: "Đã thêm khoản thu thành công"
        };
        res.status(200);
    }
    res.json(resData);
}

export async function updateKhoanThu(req, res) {
    const khoanThuData = req.body;
    const result = await DBUpdateKhoanThu(khoanThuData);
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
            message: "Cập nhật khoản thu thành công"
        };
        res.status(200);
    }
    else {
        resData = {
            type: "NOT FOUND",
            message: "Khoản thu không tồn tại"
        };
        res.status(404);
    }
    res.json(resData);
}

export async function deleteKhoanThu(req, res) {
    const result = await DBDeleteKhoanThu(req.params.maKhoanThu);
    let resData;
    if (result == "ERROR") {
        resData = {
            type: "ERROR",
            message: "Server đang có lỗi, vui lòng thử lại sau"
        };
        res.status(500);
    }
    else if (result == "KHOẢN THU KHÔNG TỒN TẠI") {
        resData = {
            type: "NOT FOUND",
            message: "Khoản thu không tồn tại"
        };
        res.status(404);
    }else {
        resData = {
            type: "OK",
            message: "Xóa khoản thu thành công"
        };
        res.status(200);
    }
    res.json(resData);
}
