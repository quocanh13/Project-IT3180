import { getLichSuList, filterLichSu } from "../request/lich-su.mjs";
import createHeader from "../header/header.mjs"

// Tạo header menu (Tab số 3 active)
createHeader(3)

// Lấy các element từ DOM
const searchForm = document.getElementById('searchForm');
const container = document.getElementById('lichSuData'); 
const tableCount = document.getElementById('tableCount');

// Các thẻ thống kê
const elTotalRooms = document.getElementById('totalRooms');
const elOccupiedRooms = document.getElementById('occupiedRooms');
const elTotalHistoryRecords = document.getElementById('totalHistoryRecords');

/**
 * Hàm xử lý chính: Tải dữ liệu và hiển thị
 */
async function loadAndRender(searchValue = null) {
    showLoading();

    const res = await getLichSuList(searchValue);
    
    if (res.type === "SUCCESS") {
        processAndRenderData(res.data);
    } else {
        handleError(res.message);
    }
}

/**
 * Xử lý sự kiện tìm kiếm
 */
if (searchForm) {
    searchForm.addEventListener('submit', async (e) => {   
        e.preventDefault();
        const keyword = document.getElementById('keyword').value.trim();
        const searchValue = keyword !== "" ? keyword : null;
        await loadAndRender(searchValue);
    });
}

/**
 * Xử lý sự kiện lọc trạng thái
 */
const filer = document.getElementById('filterStatus');
if (filer) {
    filer.addEventListener('change', async (e) => {
        const status = e.target.value;
        showLoading();

        const res = await filterLichSu(status);

        if (res.type === "SUCCESS") {
            processAndRenderData(res.data);
        } else {
            handleError(res.message);
        }
    });
}

/**
 * Hàm trung gian: Tính toán thống kê và Render thẻ
 */
function processAndRenderData(data) {
    container.innerHTML = ''; // Xóa loading/dữ liệu cũ

    if (!data || data.length === 0) {
        renderEmptyState();
        updateStats(0, 0, 0); // Reset thống kê về 0
        return;
    }

    // --- TÍNH TOÁN THỐNG KÊ ---
    const roomsWithHistoryCount = data.length; // Tổng số phòng có trong danh sách
    let occupiedCount = 0;                     // Số phòng đang có người
    let totalHistoryCount = 0;                 // Tổng số lượt ghi nhận

    data.forEach((item) => {
        // Kiểm tra xem phòng có người đang ở không (ngayRa == null)
        if (item.trangThai === "Có Người") {
            occupiedCount++;
        }

        // Cộng dồn tổng số bản ghi lịch sử
        totalHistoryCount += item.lichSuNguoiO.length;
        
        // Render từng thẻ phòng
        renderCard(item);
    });

    // --- CẬP NHẬT GIAO DIỆN THỐNG KÊ ---
    updateStats(roomsWithHistoryCount, occupiedCount, totalHistoryCount);
}

/**
 * Cập nhật các con số lên thẻ Stats
 */
function updateStats(totalRooms, occupied, totalHistory) {
    if (elTotalRooms) elTotalRooms.textContent = totalRooms;
    if (elOccupiedRooms) elOccupiedRooms.textContent = occupied;
    if (elTotalHistoryRecords) elTotalHistoryRecords.textContent = totalHistory;
    
    // Cập nhật text góc phải bảng
    if (tableCount) tableCount.textContent = `${totalRooms} căn hộ có hồ sơ`;
}

/**
 * Hiển thị màn hình Loading
 */
function showLoading() {
    container.innerHTML = `
        <div class="loading-state" style="grid-column: 1 / -1;">
            <div class="spinner"></div>
            <p>Đang tải dữ liệu lịch sử...</p>
        </div>`;
}

/**
 * Hiển thị màn hình Trống (Không có dữ liệu)
 */
function renderEmptyState() {
    container.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-bottom: 15px; opacity: 0.5;">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
            <h3>Không tìm thấy dữ liệu</h3>
            <p>Chưa có lịch sử ghi nhận nào phù hợp.</p>
        </div>
    `;
}

/**
 * Xử lý lỗi
 */
function handleError(message) {
    container.innerHTML = '';
    if (typeof createToast === "function") {
        createToast(message);
    } else {
        alert(message);
    }
}

/**
 * Render HTML cho từng Card Phòng
 */
function renderCard(item) {
    const roomStatus = item.trangThai;
    
    // Sắp xếp: Người đang ở lên đầu, sau đó đến người mới ra gần nhất
    const sortedHistory = item.lichSuNguoiO.sort((a, b) => {
        if (!a.ngayRa && b.ngayRa) return -1;
        if (a.ngayRa && !b.ngayRa) return 1;
        return new Date(b.ngayVao) - new Date(a.ngayVao);
    });

    let historyHtml = '';
    sortedHistory.forEach(person => {
        const isStaying = !person.ngayRa;
        const ngayVao = person.ngayVao ? new Date(person.ngayVao).toLocaleDateString('vi-VN') : '---';
        const ngayRa = person.ngayRa ? new Date(person.ngayRa).toLocaleDateString('vi-VN') : 'Hiện tại';
        
        // Style highlight cho dòng của người đang ở
        const rowStyle = isStaying ? 'color: var(--primary-color); font-weight: 600; background: #f0f9ff; border-color: #b3d7ff;' : '';
        const iconStatus = isStaying ? '<i class="status-icon active"></i>' : '<i class="status-icon inactive"></i>';
        const timeStyle = isStaying ? 'color: var(--primary-color); font-weight: 700;' : 'color: #666;';

        historyHtml += `
            <div class="room-info-row" style="${rowStyle}">
                <div style="flex: 1; display: flex; align-items: center; gap: 12px;">
                    ${iconStatus}
                    <div style="display: flex; flex-direction: column;">
                        <span>${person.hoTen}</span>
                        <span style="font-size: 0.85em; opacity: 0.7;">${person.cccd}</span>
                    </div>
                </div>

                <div style="font-size: 0.95em; text-align: right; ${timeStyle}; white-space: nowrap;">
                    <span>${ngayVao}</span>
                    <span style="margin: 0 6px; color: #999; font-size: 0.8em;">&#10142;</span>
                    <span>${ngayRa}</span>
                </div>
            </div>
        `;
    });

    const card = document.createElement('div');
    card.className = 'room-card';
    card.innerHTML = `
        <div class="room-card-header">
            <h3 class="room-card-title">Phòng ${item.soPhong}</h3>
            <span class="room-status-badge">
                ${roomStatus}
            </span>
        </div>

        <div class="room-card-body">
            <div class="list-sticky-header">
                <span>Cư dân</span>
                <span>Thời gian lưu trú</span>
            </div>
            
            ${historyHtml}
        </div>
    `;

    container.appendChild(card);
}

// Khởi chạy lần đầu
loadAndRender();