import { getHoKhauList as DBGetHoKhauList, getHoKhau as DBGetHoKhau, insertHoKhau as DBInsertHoKhau, updateHoKhau as DBUpdateHoKhau, deleteHoKhau as DBDeleteHoKhau, addThanhVien as DBAddThanhVien, deleteThanhVien as DBDeleteThanhVien } from "../services/ho-khau/ho-khau.mjs";
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
    const data = await DBGetHoKhau(req.params.chuHo);
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
    // Đảm bảo chuHo là String
    if (req.body.chuHo) {
        req.body.chuHo = String(req.body.chuHo);
    }
    // Đảm bảo soNha là Number
    if (req.body.soNha) {
        req.body.soNha = Number(req.body.soNha);
    }
    
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
    // Đảm bảo chuHo là String
    if (req.body.chuHo) {
        req.body.chuHo = String(req.body.chuHo);
    }
    // Đảm bảo soNha là Number
    if (req.body.soNha) {
        req.body.soNha = Number(req.body.soNha);
    }
    
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
    const chuHo = req.params.chuHo;
    if (!chuHo || chuHo.trim() === '') {
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
export async function addThanhVien(req, res) {
    let resData;
    const chuHo = req.params.chuHo, thanhVien = req.params.thanhVien;
    const result = await DBAddThanhVien(chuHo, thanhVien);
    if (result == "OK") {
        resData = {
            type: "OK",
            message: "Đã thêm thành viên thành công"
        };
        res.status(200);
    }
    else if (result == "CHỦ HỘ KHÔNG TỒN TẠI") {
        resData = {
            type: "NOT FOUND",
            message: "Không tìm thấy hộ"
        };
        res.status(404);
    }
    else if (result == "THÀNH VIÊN KHÔNG TỒN TẠI") {
        resData = {
            type: "NOT FOUND",
            message: "Không tìm thấy thành viên trong danh sách nhân khẩu"
        };
        res.status(404);
    }
    else if (result == "THÀNH VIÊN ĐÃ TRONG HỘ RỒI") {
        resData = {
            type: "BAD REQUEST",
            message: "Thành viên đã trong hộ rồi"
        };
        res.status(400);
    }
    else {
        resData = {
            type: "ERROR",
            message: "Server có lỗi vui lòng thử lại sau"
        };
        res.status(500);
    }
    res.json(resData);
}
export async function deleteThanhVien(req, res) {
    let resData;
    const chuHo = req.params.chuHo, thanhVien = req.params.thanhVien;
    const result = await DBDeleteThanhVien(chuHo, thanhVien);
    if (result == "OK") {
        resData = {
            type: "OK",
            message: "Đã xóa thành viên thành công"
        };
        res.status(200);
    }
    else if (result == "CHỦ HỘ KHÔNG TỒN TẠI") {
        resData = {
            type: "NOT FOUND",
            message: "Không tìm thấy hộ"
        };
        res.status(404);
    }
    else if (result == "THÀNH VIÊN KHÔNG TỒN TẠI") {
        resData = {
            type: "NOT FOUND",
            message: "Không tìm thấy thành viên trong danh sách nhân khẩu"
        };
        res.status(404);
    }
    else if (result == "THÀNH VIÊN KHÔNG TRONG HỘ") {
        resData = {
            type: "BAD REQUEST",
            message: "Thành viên không có trong hộ"
        };
        res.status(400);
    }
    else {
        resData = {
            type: "ERROR",
            message: "Server có lỗi vui lòng thử lại sau"
        };
        res.status(500);
    }
    res.json(resData);
}
