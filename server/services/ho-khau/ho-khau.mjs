import HoKhau from "../../config/models/ho_khau-model.mjs";
import { NhanKhauModel } from "../../config/models/nhan_khau-model.mjs";

/**
 * Hàm lấy danh sách hộ khẩu
 * @param {number} offset - Vị trí bắt đầu 
 * @param {number} limit - Số lượng, nếu là -1 thì lấy toàn bộ nhân khẩu
 * @returns {Promise<number[] | "ERROR">} - Trả về mảng lưu số CCCD của chủ hộ | Trả về "ERROR" nếu có lỗi
 */
export async function getHoKhauList(offset, limit) {
    try {
        let query = HoKhau.find({ deleted: false }).sort("canHo").select('_id');

        if (limit !== -1) {
            query = query.skip(offset).limit(limit);
        }

        const hoKhauList = await query.exec();
        return hoKhauList.map(hk => hk._id);
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
export async function getHoKhau(_id) {
    try {
        const hoKhau = await HoKhau.findOne({ _id , deleted: false }).exec();

        if (!hoKhau) {
            return "HỘ KHẨU KHÔNG TỒN TẠI";
        }
        
        // Đếm số thành viên từ collection nhan_khau
        const thanhVienCount = await NhanKhauModel.countDocuments({ hoKhau: _id });
        const thanhVien = await NhanKhauModel.find({ hoKhau: _id });
        
        // Chuyển sang plain object để thêm field
        const hoKhauObj = hoKhau.toObject();
        hoKhauObj.numMembers = thanhVienCount;
        hoKhauObj.thanhVien = thanhVien;
        return hoKhauObj;
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
 
        const existingHoKhau = await HoKhau.findOne({ chuHo: hoKhau.chuHo , deleted: false });
        if(existingHoKhau) {
            return "HỘ ĐÃ TỒN TẠI";
        }

        const existingCanHo = await HoKhau.findOne({ canHo: hoKhau.canHo , chuHo: { $ne: hoKhau.chuHo }, deleted: false });
        if(existingCanHo) {
            return "CĂN HỘ ĐÃ CÓ HỘ KHẨU";
        }

        const newHoKhau = new HoKhau(hoKhau);
        await newHoKhau.save();

        // Cập nhật nhân khẩu với _id của hộ khẩu (không phải chuHo CCCD)
        await NhanKhauModel.updateOne({ cccd: hoKhau.chuHo }, { hoKhau: newHoKhau._id, quanHeVoiChuHo: "Chủ Hộ" });

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
export async function deleteHoKhau(_id) {
    try {
        const result = await HoKhau.updateOne({ _id: _id, deleted: false }, { deleted: true, deletedAt: new Date() });    
        if(result.modifiedCount === 1) {
            await NhanKhauModel.updateMany({ hoKhau: _id, deleted: false }, { deleted: true, deletedAt: new Date() });
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

        if(hoKhau.chuHo !== null && hoKhau.chuHo !== undefined) {
            updateData.chuHo = hoKhau.chuHo;
        }

        if(hoKhau.canHo !== null && hoKhau.canHo !== undefined) {
            updateData.canHo = hoKhau.canHo;
            
            // Chỉ check canHo trùng nếu canHo được thay đổi
            const existingHoKhau = await HoKhau.findOne({ canHo: hoKhau.canHo , _id: { $ne: hoKhau._id }, deleted: false });
            if(existingHoKhau) {
                return "CĂN HỘ ĐÃ CÓ HỘ KHẨU";
            }
        }
        
        if(hoKhau.ngayDK !== null && hoKhau.ngayDK !== undefined) {
            updateData.ngayDK = hoKhau.ngayDK;
        }

        await HoKhau.updateOne({ _id: hoKhau._id, deleted: false }, updateData);
        return "OK";
    } catch(error) {
        console.error("Update error:", error);
        return "ERROR";
    }
}

/**
 * Hàm thêm thành viên vào hộ
 * @param {string} _id - ID của hộ khẩu
 * @param {number} cccd - Số CCCD của thành viên
 * @returns {Promise<"OK" | "ERROR" | "CHỦ HỘ KHÔNG TỒN TẠI" | "THÀNH VIÊN KHÔNG TỒN TẠI" | "THÀNH VIÊN ĐÃ TRONG HỘ RỒI">}
 */
export async function addThanhVien(_id, cccd) {
    try {
        const existingHoKhau = await HoKhau.findOne({ _id: _id , deleted: false });
        if(!existingHoKhau) {
            return "HỘ KHÔNG TỒN TẠI";
        }

        const existingThanhVien = await NhanKhauModel.findOne({ cccd: cccd, deleted: false });
        if(existingThanhVien && existingThanhVien.hoKhau) {
            if(existingThanhVien.hoKhau.toString() === _id.toString()) {
                return "THÀNH VIÊN ĐÃ TRONG HỘ RỒI";
            } else {
                return "THÀNH VIÊN ĐÃ THUỘC HỘ KHẨU KHÁC";
            }
        }
        if(!existingThanhVien) {
            return "THÀNH VIÊN KHÔNG TỒN TẠI";
        }

        await NhanKhauModel.updateOne({ cccd: cccd }, { hoKhau: _id });
        return "OK";
    } catch (error) {
        console.error("Add ThanhVien error:", error);
        return "ERROR";
    }
}

/**
 * Hàm xóa thành viên khỏi hộ
 * @param {string} _id - ID của hộ khẩu
 * @param {number} cccd - Số CCCD của thành viên
 * @returns {Promise<"OK" | "ERROR" | "CHỦ HỘ KHÔNG TỒN TẠI" | "THÀNH VIÊN KHÔNG TỒN TẠI" | "THÀNH VIÊN KHÔNG TRONG HỘ">}
 */
export async function deleteThanhVien(_id, cccd) {
    try {
        const existingHoKhau = await HoKhau.findOne({ _id: _id , deleted: false });
        if(!existingHoKhau) {
            return "HỘ KHÔNG TỒN TẠI";
        }   
        const existingThanhVien = await NhanKhauModel.findOne({ cccd: cccd, hoKhau: _id, deleted: false });
        if(!existingThanhVien) {
            return "THÀNH VIÊN KHÔNG TRONG HỘ";
        }
        await NhanKhauModel.updateOne({ cccd: cccd }, { $unset: { hoKhau: "" ,quanHeVoiChuHo: ""} });
        return "OK";
    } catch (error) {
        console.error("Delete ThanhVien error:", error);
        return "ERROR";
    }
}
export async function getHoKhauSearch(keyword) {
    try {
        let find = { deleted: false };

        if (keyword) {
            const regex = new RegExp(keyword, 'i');
            const nhanKhauList = await NhanKhauModel.find({ 
                hoTen: regex, 
                quanHeVoiChuHo: "Chủ Hộ",
                deleted: false 
            }).exec();
            const hoKhauIdsFromNhanKhau = nhanKhauList
                .map(nk => nk.hoKhau)
                .filter(id => id != null);
            let orConditions = [
                { chuHo: keyword }, 
                { _id: { $in: hoKhauIdsFromNhanKhau } } 
            ];
            if (!isNaN(keyword) && keyword.trim() !== "") {
                orConditions.push({ canHo: Number(keyword) });
            }
            find.$or = orConditions;
        }       
        const hoKhauSearch = await HoKhau.find(find).select('_id').exec();
        return hoKhauSearch.map(hk => hk._id.toString()); 
        
    } catch (error) {
        console.error("Search HoKhau error:", error);
        return "ERROR";
    } 
}
        