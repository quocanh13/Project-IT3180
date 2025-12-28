import { getNhanKhauList as DBGetNhanKhauList, getNhanKhau as DBGetNhanKhau, insertNhanKhau as DBInsertNhanKhau, updateNhanKhau as DBUpdateNhanKhau, deleteNhanKhau as DBDeleteNhanKhau, searchNhanKhau as DBSearchNhanKhau, filterNhanKhau as DBFilterNhanKhau } from "../services/nhan-khau/nhan-khau.mjs";

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
    const data = await DBGetNhanKhau(req.params.cccd);
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
    const nhanKhauData = req.body;
    const result = await DBInsertNhanKhau(nhanKhauData);
    let resData;
    if (result == "ERROR") {
        resData = {
            type: "ERROR",
            message: "Server đang có lỗi, vui lòng thử lại sau"
        };
        res.status(500);
    }
    else if (result == "CCCD KHÔNG HỢP LỆ") {
        resData = {
            type: "BAD REQUEST",
            message: "CCCD không hợp lệ"
        };
        res.status(400);
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
    const result = await DBDeleteNhanKhau(req.params.cccd);
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
    } else if (result == "KHÔNG THỂ XÓA CHỦ HỘ") {
        resData = {
            type: "BAD REQUEST",
            message: "Không thể xóa chủ hộ"
        };
        res.status(400);
    } else {
        resData = {
            type: "OK",
            message: "Xóa nhân khẩu thành công"
        };
        res.status(200);
    }
    res.json(resData);
}
export async function searchNhanKhau(req, res) {
    let resData;
    const keyword = req.query.keyword || "";
    const data = await DBSearchNhanKhau(keyword);  
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
export async function filterNhanKhau(req, res) {
    let resData;
    const gioiTinh = req.query.gioiTinh || "";
    try {
        const fileterData = await DBFilterNhanKhau(gioiTinh);
        resData = {
            type: "OK",
            data: fileterData
        };
        res.status(200);
    } catch (error) {
        resData = {
            type: "ERROR",
            message: "Server đang có lỗi vui lòng thử lại sau"
        };
        res.status(500);
    }   
    res.json(resData);
};