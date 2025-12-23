import { getNhanKhauList as DBGetNhanKhauList, getNhanKhau as DBGetNhanKhau, insertNhanKhau as DBInsertNhanKhau, updateNhanKhau as DBUpdateNhanKhau, deleteNhanKhau as DBDeleteNhanKhau } from "../services/nhan-khau/nhan-khau.mjs";

export async function getNhanKhauList(req, res) {
    let resData;
    const offset = Number(req.query.offset) || 0;
    const limit = Number(req.query.limit) || 10;
    const data = await DBGetNhanKhauList(offset, limit);
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

export async function getNhanKhau(req, res) {
    let resData;
    const data = await DBGetNhanKhau(Number(req.params.cccd));
    if (data == "ERROR") {
        resData = {
            type: "ERROR",
            message: "Server đang có lỗi vui lòng thử lại sau"
        };
        res.status(500);
    }
    else if (data == "NHÂN KHẨU KHÔNG TỒN TẠI") {
        resData = {
            type: "NOT FOUND",
            message: "Nhân khẩu không tồn tại"
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

export async function insertNhanKhau(req, res) {
    console.log("123");
    const nhanKhauData = req.body;
    if (nhanKhauData.cccd) {
        nhanKhauData.cccd = Number(nhanKhauData.cccd);
    }
    const result = await DBInsertNhanKhau(nhanKhauData);
    let resData;
    if (result == "ERROR") {
        resData = {
            type: "ERROR",
            message: "Server đang có lỗi, vui lòng thử lại sau"
        };
        res.status(500);
    }
    else if (result == "NHÂN KHẨU ĐÃ TỒN TẠI") {
        resData = {
            type: "BAD REQUEST",
            message: "Nhân khẩu đã tồn tại"
        };
        res.status(400);
    }
    else {
        resData = {
            type: "OK",
            message: "Đã thêm nhân khẩu thành công"
        };
        res.status(200);
    }
    res.json(resData);
}

export async function updateNhanKhau(req, res) {
    const nhanKhauData = req.body;
    if (nhanKhauData.cccd) {
        nhanKhauData.cccd = Number(nhanKhauData.cccd);
    }
    const result = await DBUpdateNhanKhau(nhanKhauData);
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
            message: "Cập nhật nhân khẩu thành công"
        };
        res.status(200);
    }
    else {
        resData = {
            type: "NOT FOUND",
            message: "Nhân khẩu không tồn tại"
        };
        res.status(404);
    }
    res.json(resData);
}

export async function deleteNhanKhau(req, res) {
    const result = await DBDeleteNhanKhau(Number(req.params.cccd));
    let resData;
    if (result == "ERROR") {
        resData = {
            type: "ERROR",
            message: "Server đang có lỗi, vui lòng thử lại sau"
        };
        res.status(500);
    }
    else if (result == "NHÂN KHẨU KHÔNG TỒN TẠI") {
        resData = {
            type: "NOT FOUND",
            message: "Nhân khẩu không tồn tại"
        };
        res.status(404);
    }
    else {
        resData = {
            type: "OK",
            message: "Xóa nhân khẩu thành công"
        };
        res.status(200);
    }
    res.json(resData);
}
