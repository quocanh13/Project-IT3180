import { getLichSuList as DBGetLichSuList } from "../services/lich-su/lich-su.mjs";

export async function getLichSuList(req, res) {
    try {
        const canHoFilter = req.query.canHo ? parseInt(req.query.canHo) : null;
        const data = await DBGetLichSuList(canHoFilter);
        res.status(200).json({ type: "SUCCESS", data: data });
    } catch (error) {
        res.status(500).json({ type: "ERROR", message: "Lỗi hệ thống" });
    }
}