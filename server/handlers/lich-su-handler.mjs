import { getLichSuList as DBGetLichSuList, filterLichSu as DBFilterLichSu } from "../services/lich-su/lich-su.mjs";

export async function getLichSuList(req, res) {
    try {
        const searchValue = req.query.searchValue ? req.query.searchValue : null;
        const data = await DBGetLichSuList(searchValue);
        res.status(200).json({ type: "SUCCESS", data: data });
    } catch (error) {
        res.status(500).json({ type: "ERROR", message: "Lỗi hệ thống" });
    }
}

export async function filterLichSu(req, res) {
    try {
        const status = req.query.status || null;
        const data = await DBFilterLichSu(status);
        res.status(200).json({ type: "SUCCESS", data: data });
    } catch (error) {
        res.status(500).json({ type: "ERROR", message: "Lỗi hệ thống" });
    }   
}