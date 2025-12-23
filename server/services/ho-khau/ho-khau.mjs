import HoKhau from "../../config/models/ho_khau-model.mjs";

/**
 * Hàm lấy danh sách hộ khẩu
 * @param {number} offset - Vị trí bắt đầu 
 * @param {number} limit - Số lượng, nếu là -1 thì lấy toàn bộ nhân khẩu
 * @returns {Promise<number[] | "ERROR">} - Trả về mảng lưu số CCCD của chủ hộ | Trả về "ERROR" nếu có lỗi
 */
export async function getHoKhauList(offset, limit) {
    try {
        let query = HoKhau.find().select("chuHo -_id");

        if (limit !== -1) {
            query = query.skip(offset).limit(limit);
        }

        const hoKhauList = await query.exec();
        return hoKhauList.map(hk => hk.chuHo);
    } catch (error) {
        console.error("Get HoKhau error:", error);
        return "ERROR";
    }
}


/**
 * Hàm lấy thông tin hộ khẩu tương ứng số CCCD của chủ hộ
 * @param {number} chuHo - Số CCCD của chủ hộ
 * @returns {Promise<HoKhau | "ERROR" | "HỘ KHẨU KHÔNG TỒN TẠI">} 
 * Trả về HoKhau nếu thành công
 * 
 * Trả về "ERROR" nếu có lỗi
 * 
 * Trả về "HỘ KHẨU KHÔNG TỒN TẠI" nếu hộ khẩu không tồn tại
 */
export async function getHoKhau(chuHo) {
    try {
        const hoKhau = await HoKhau.findOne({ chuHo }).exec();

        if (!hoKhau) {
            return "HỘ KHẨU KHÔNG TỒN TẠI";
        }

        return hoKhau;
    } catch (error) {
        console.error("Get HoKhau error:", error);
        return "ERROR";
    }
}

/**
 * Hàm thêm một hộ khẩu mới
 * @param {HoKhau} hoKhau 
 * @returns {Promise<"OK" | "ERROR" | "HỘ ĐÃ TỒN TẠI">}
 * Trả về "OK" nếu thành công
 * 
 * Trả về "ERROR" nếu có lỗi
 * 
 * Trả về "HỘ ĐÃ TỒN TẠI" nếu chủ hộ của hộ khẩu được thêm vào đã là chủ hộ của một hộ khác (1 người chỉ được là chủ hộ của 1 hộ)
 */
export async function insertHoKhau(hoKhau) {
    try {
        if(!hoKhau || !hoKhau.chuHo) {
            return "ERROR";
        }
 
        const existingHoKhau = await HoKhau.findOne({ chuHo: hoKhau.chuHo });
        if(existingHoKhau) {
            return "HỘ ĐÃ TỒN TẠI";
        }

        const existingSoNha = await HoKhau.findOne({ soNha: hoKhau.soNha , chuHo: { $ne: hoKhau.chuHo } });
        if(existingSoNha) {
            return "PHÒNG ĐÃ CÓ HỘ KHẨU";
        }

        const newHoKhau = new HoKhau(hoKhau);
        await newHoKhau.save();

        return "OK";
    } catch(error) {
        console.error("Insert error:", error);
        return "ERROR";
    }
}

/**
 * Hàm xóa một hộ
 * @param {number} chuHo 
 * @returns {Promise<"OK" | "ERROR">}
 * Trả về "OK" nếu thành công
 * 
 * Trả về "ERROR" nếu có lỗi
 */
export async function deleteHoKhau(chuHo) {
    try {
        const result = await HoKhau.deleteOne({ chuHo: chuHo });    
        if(result.deletedCount === 1) {
            return "OK";
        } else {
            return "HỘ KHÔNG TỒN TẠI";
        }
    } catch(error) {
        console.error("Delete error:", error);
        return "ERROR";
    }
}

/**
 * Hàm cập nhật thông tin hộ khẩu
 * @param {HoKhau} hoKhau - Kiểm tra từng thuộc tính nếu khác null và undefined thì cập nhật còn không thì bỏ qua
 * @returns {Promise<"OK" | "ERROR">}
 * Trả về "OK" nếu thành công
 * 
 * Trả về "ERROR" nếu có lỗi
 */
export async function updateHoKhau(hoKhau) {
    try {
        if(!hoKhau || !hoKhau.chuHo) {
            return "ERROR";
        }   
        const updateData = {};

        if(hoKhau.thanhVien !== null && hoKhau.thanhVien !== undefined) {
            updateData.thanhVien = hoKhau.thanhVien;
        }

        if(hoKhau.soNha !== null && hoKhau.soNha !== undefined) {
            updateData.soNha = hoKhau.soNha;
            
            // Chỉ check soNha trùng nếu soNha được thay đổi
            const existingHoKhau = await HoKhau.findOne({ soNha: hoKhau.soNha , chuHo: { $ne: hoKhau.chuHo } });
            if(existingHoKhau) {
                return "PHÒNG ĐÃ CÓ HỘ KHẨU";
            }
        }
        
        if(hoKhau.ngayDK !== null && hoKhau.ngayDK !== undefined) {
            updateData.ngayDK = hoKhau.ngayDK;
        }

        await HoKhau.updateOne({ chuHo: hoKhau.chuHo }, updateData);
        return "OK";
    } catch(error) {
        console.error("Update error:", error);
        return "ERROR";
    }
}

/**
 * Hàm thêm thành viên vào hộ
 * @param {number} chuHo - Số CCCD của chủ hộ
 * @param {number} cccd - Số CCCD của thành viên
 * @returns {Promise<"OK" | "ERROR" | "CHỦ HỘ KHÔNG TỒN TẠI" | "THÀNH VIÊN KHÔNG TỒN TẠI" | "THÀNH VIÊN ĐÃ TRONG HỘ RỒI">}
 */
export async function addThanhVien(chuHo, cccd) {
    try {
        const existingHoKhau = await HoKhau.findOne({ chuHo: chuHo });
        if(!existingHoKhau) {
            return "CHỦ HỘ KHÔNG TỒN TẠI";
        }

        const existingThanhVien = await HoKhau.findOne({ thanhVien: cccd });
        if(existingThanhVien) {
            return "THÀNH VIÊN ĐÃ TRONG HỘ RỒI";
        }

        await HoKhau.updateOne({ chuHo: chuHo }, { $push: { thanhVien: cccd } });
        return "OK";
    } catch (error) {
        console.error("Add ThanhVien error:", error);
        return "ERROR";
    }
}

/**
 * Hàm xóa thành viên khỏi hộ
 * @param {number} chuHo - Số CCCD của chủ hộ
 * @param {number} cccd - Số CCCD của thành viên
 * @returns {Promise<"OK" | "ERROR" | "CHỦ HỘ KHÔNG TỒN TẠI" | "THÀNH VIÊN KHÔNG TỒN TẠI" | "THÀNH VIÊN KHÔNG TRONG HỘ">}
 */
export async function deleteThanhVien(chuHo, cccd) {
    try {
        const existingHoKhau = await HoKhau.findOne({ chuHo: chuHo });
        if(!existingHoKhau) {
            return "CHỦ HỘ KHÔNG TỒN TẠI";
        }   
        const existingThanhVien = await HoKhau.findOne({ chuHo: chuHo, thanhVien: cccd });
        if(!existingThanhVien) {
            return "THÀNH VIÊN KHÔNG TRONG HỘ";
        }
        await HoKhau.updateOne({ chuHo: chuHo }, { $pull: { thanhVien: cccd } });
        return "OK";
    } catch (error) {
        console.error("Delete ThanhVien error:", error);
        return "ERROR";
    }
}
        