import { getKhoanThuList } from "../request/khoan-thu.mjs";
import { getNopTienList, insertNopTien } from "../request/nop-tien.mjs";
import { getNhanKhauList, getNhanKhau } from "../request/nhan-khau.mjs";
import createHeader from "../header/header.mjs"
import createToast from "../utils/toast/toast.mjs"

createHeader(2); // Active menu Thu Chi

// Cấu hình DOM
const container = document.getElementById('thuChiData');
const tableCount = document.getElementById('tableCount');
const searchForm = document.getElementById('searchForm');
const filterType = document.getElementById('filterType');

// Stats Elements
const elTotalKhoanThu = document.getElementById('totalKhoanThu');
const elTotalCollected = document.getElementById('totalCollected');
const elTotalTransactions = document.getElementById('totalTransactions');

// Modal Elements - Khoản Thu
const modal = document.getElementById('khoanThuModal');
const btnAddKhoanThu = document.getElementById('btnAddKhoanThu');
const btnCloseModal = document.getElementById('btnCloseModal');
const btnCancelModal = document.getElementById('btnCancelModal');
const khoanThuForm = document.getElementById('khoanThuForm');
const modalTitle = document.getElementById('modalTitle');

// Modal Elements - Nộp Tiền
const nopTienModal = document.getElementById('nopTienModal');
const btnCloseNopTienModal = document.getElementById('btnCloseNopTienModal');
const btnCancelNopTienModal = document.getElementById('btnCancelNopTienModal');
const nopTienForm = document.getElementById('nopTienForm');

// Helper format tiền
const formatMoney = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0);
};

// ==============================================
// MODAL FUNCTIONS
// ==============================================

function openModal(mode = 'add', data = null) {
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    if (mode === 'add') {
        modalTitle.textContent = 'Thêm Khoản Thu';
        khoanThuForm.reset();
        document.getElementById('khoanThuId').value = '';
    } else if (mode === 'edit' && data) {
        modalTitle.textContent = 'Sửa Khoản Thu';
        document.getElementById('khoanThuId').value = data.maKhoanThu;
        document.getElementById('tenKhoanThu').value = data.tenKhoanThu;
        document.getElementById('soTien').value = data.soTien;
        document.getElementById('loaiKhoanThu').value = data.loaiKhoanThu;
    }
}

function closeModal() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
    khoanThuForm.reset();
}

async function loadNhanKhauList() {
    const select = document.getElementById('maNhanKhauNop');
    select.innerHTML = '<option value="" disabled selected>Đang tải...</option>';
    
    try {
        const response = await getNhanKhauList(0, -1);
        
        if (response.type === "OK") {
            const listNhanKhau = response.data;
            
            if (!listNhanKhau || listNhanKhau.length === 0) {
                select.innerHTML = '<option value="" disabled>Chưa có nhân khẩu nào</option>';
                createToast('Chưa có nhân khẩu trong hệ thống', true);
                return;
            }
            
            select.innerHTML = '<option value="" disabled selected>-- Chọn người nộp tiền --</option>';
            
            for (const nhanKhau of listNhanKhau) {
                const option = document.createElement('option');
                option.value = nhanKhau.cccd;
                option.textContent = `${nhanKhau.hoTen} - ${nhanKhau.cccd}`;
                select.appendChild(option);
            }
        } else {
            select.innerHTML = '<option value="" disabled>Lỗi tải dữ liệu</option>';
            createToast(response.message || 'Không thể tải danh sách nhân khẩu', true);
        }
    } catch (error) {
        console.error('Error loading nhan khau:', error);
        select.innerHTML = '<option value="" disabled>Lỗi tải dữ liệu</option>';
        createToast('Lỗi khi tải danh sách nhân khẩu', true);
    }
}

async function openNopTienModal(maKhoanThu) {
    nopTienModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    document.getElementById('maKhoanThuNop').value = maKhoanThu;
    // Set ngày hiện tại
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('ngayNop').value = today;
    
    // Load danh sách nhân khẩu
    await loadNhanKhauList();
}

function closeNopTienModal() {
    nopTienModal.style.display = 'none';
    document.body.style.overflow = 'auto';
    nopTienForm.reset();
}

// Event Listeners for Modal
if (btnAddKhoanThu) {
    btnAddKhoanThu.addEventListener('click', () => openModal('add'));
}

if (btnCloseModal) {
    btnCloseModal.addEventListener('click', closeModal);
}

if (btnCancelModal) {
    btnCancelModal.addEventListener('click', closeModal);
}

if (btnCloseNopTienModal) {
    btnCloseNopTienModal.addEventListener('click', closeNopTienModal);
}

if (btnCancelNopTienModal) {
    btnCancelNopTienModal.addEventListener('click', closeNopTienModal);
}

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
    }
    if (e.target === nopTienModal) {
        closeNopTienModal();
    }
});

// Form Submit Handler - Khoản Thu
if (khoanThuForm) {
    khoanThuForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const id = document.getElementById('khoanThuId').value;
        const data = {
            tenKhoanThu: document.getElementById('tenKhoanThu').value.trim(),
            soTien: Number(document.getElementById('soTien').value),
            loaiKhoanThu: document.getElementById('loaiKhoanThu').value
        };
        
        // Thêm maKhoanThu vào body khi edit
        if (id) {
            data.maKhoanThu = id;
        }
        
        try {
            const url = id ? `/khoan-thu/${id}` : '/khoan-thu';
            const method = id ? 'PUT' : 'POST';
            
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            
            const result = await response.json();
            
            if (result.type === 'SUCCESS' || result.type === 'OK') {
                createToast(result.message || (id ? 'Cập nhật khoản thu thành công!' : 'Thêm khoản thu mới thành công!'), false);
                setTimeout(() => {
                    closeModal();
                    loadAndRender(); // Reload data
                }, 100);
            } else {
                createToast(result.message || 'Có lỗi xảy ra!', true);
            }
        } catch (error) {
            console.error('Error:', error);
            createToast('Có lỗi xảy ra khi lưu dữ liệu!', true);
        }
    });
}

// Form Submit Handler - Nộp Tiền
if (nopTienForm) {
    nopTienForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const maKhoanThu = document.getElementById('maKhoanThuNop').value;
        const nguoiNop = document.getElementById('maNhanKhauNop').value;
        const soTien = parseFloat(document.getElementById('soTienNop').value);
        const ngayNop = new Date(document.getElementById('ngayNop').value);
        
        const nopTienData = {
            maKhoanThu,
            nguoiNop,
            soTien,
            ngayNop
        };
        
        try {
            const response = await insertNopTien(nopTienData);
            
            if (response.type === 'OK' || response.type === 'SUCCESS') {
                createToast(response.message || 'Thêm nộp tiền thành công', false);
                setTimeout(() => {
                    closeNopTienModal();
                    loadAndRender(); // Reload data
                }, 100);
            } else {
                createToast(response.message || 'Có lỗi xảy ra', true);
            }
        } catch (error) {
            console.error('Error:', error);
            createToast('Có lỗi xảy ra khi thêm nộp tiền', true);
        }
    });
}

// ==============================================
// MAIN LOGIC
// ==============================================

async function loadAndRender(keyword = null, type = null) {
    // Hiển thị loading
    container.innerHTML = `<div class="loading-state"><div class="spinner"></div><p>Đang tải dữ liệu...</p></div>`;

    try {
        // BƯỚC 0: Lấy tổng số hộ khẩu
        const resHoKhau = await fetch('/ho-khau?offset=0&limit=-1');
        const hoKhauData = await resHoKhau.json();
        const tongSoHoKhau = hoKhauData.type === 'SUCCESS' || hoKhauData.type === 'OK' ? hoKhauData.data.length : 0;

        // BƯỚC 1: Lấy danh sách Khoản Thu trước
        const resKhoanThu = await getKhoanThuList();
        
        if (!resKhoanThu || (resKhoanThu.type !== 'SUCCESS' && resKhoanThu.type !== 'OK') || !resKhoanThu.data) {
             throw new Error("Không thể tải danh sách khoản thu");
        }

        let khoanThuData = resKhoanThu.data;

        // BƯỚC 2: Lọc dữ liệu Khoản Thu (Lọc trước để giảm số lần gọi API con)
        if (keyword) {
            const k = keyword.toLowerCase();
            khoanThuData = khoanThuData.filter(item => 
                item.tenKhoanThu.toLowerCase().includes(k)
            );
        }
        
        if (type) {
            // Model: loaiKhoanThu là 'bắt buộc' hoặc 'tự nguyện'
            khoanThuData = khoanThuData.filter(item => item.loaiKhoanThu === type);
        }

        if (khoanThuData.length === 0) {
            container.innerHTML = `<div class="empty-state"><h3>Không có dữ liệu phù hợp</h3></div>`;
            updateStats(0, 0, 0);
            return;
        }

        // BƯỚC 3: Gọi API chi tiết cho TỪNG khoản thu (Để tránh lỗi undefined ở backend)
        // Dùng Promise.all để gọi song song cho nhanh
        const processedData = await Promise.all(khoanThuData.map(async (khoan) => {
            let danhSachNop = [];
            let thucThu = 0;
            let danhSachCCCD = new Set(); // Để đếm số CCCD duy nhất

            try {
                // Gọi API lấy nộp tiền riêng cho mã khoản thu này
                // Truyền offset=0, limit=-1 (lấy tất cả), và maKhoanThu
                const resNop = await getNopTienList(0, -1, khoan.maKhoanThu);
                
                if (resNop && (resNop.type === 'SUCCESS' || resNop.type === 'OK')) {
                    danhSachNop = resNop.data;
                    
                    // Tính tổng tiền
                    thucThu = danhSachNop.reduce((sum, nop) => sum + (Number(nop.soTien) || 0), 0);
                    
                    // Đếm số căn hộ duy nhất đã nộp (dựa vào canHo)
                    danhSachNop.forEach(nop => {
                        if (nop.canHo) danhSachCCCD.add(nop.canHo);
                    });
                    
                    // Sắp xếp người mới nộp lên đầu
                    danhSachNop.sort((a, b) => new Date(b.ngayNop) - new Date(a.ngayNop));
                }
            } catch (err) {
                console.warn(`Lỗi lấy chi tiết nộp tiền cho khoản ${khoan.maKhoanThu}`, err);
            }

            return {
                ...khoan,
                stats: {
                    thucThu,
                    soLuotNop: danhSachCCCD.size,
                    danhSachNop
                },
                tongSoHo: tongSoHoKhau
            };
        }));

        // BƯỚC 4: Render ra màn hình
        renderGrid(processedData);

    } catch (error) {
        console.error("Lỗi loadAndRender:", error);
        container.innerHTML = `<div class="empty-state"><h3>Lỗi tải dữ liệu</h3><p>${error.message}</p></div>`;
    }
}

function renderGrid(data) {
    container.innerHTML = '';
    
    let grandTotalMoney = 0;
    let grandTotalTrans = 0;

    data.forEach(item => {
        grandTotalMoney += item.stats.thucThu;
        grandTotalTrans += item.stats.soLuotNop;
        renderCard(item);
    });

    // Cập nhật 3 thẻ Stats trên cùng
    updateStats(data.length, grandTotalMoney, grandTotalTrans);
}

function updateStats(count, money, trans) {
    if(elTotalKhoanThu) elTotalKhoanThu.textContent = count;
    if(elTotalCollected) elTotalCollected.textContent = formatMoney(money);
    if(elTotalTransactions) elTotalTransactions.textContent = trans;
    if(tableCount) tableCount.textContent = `${count} khoản thu`;
}

function renderCard(item) {
    const card = document.createElement('div');
    card.className = 'room-card';
    
    // Xử lý giao diện theo loại
    const isBatBuoc = item.loaiKhoanThu === 'bắt buộc';
    const headerClass = isBatBuoc ? 'header-batbuoc' : 'header-tunguyen';
    const badgeClass = isBatBuoc ? 'badge-batbuoc' : 'badge-tunguyen';

    // Tạo HTML bảng chi tiết người nộp
    let tableRowsHTML = '';
    
    if (item.stats.danhSachNop.length > 0) {
        item.stats.danhSachNop.forEach((nop, index) => {
            const ngayNop = nop.ngayNop ? new Date(nop.ngayNop).toLocaleDateString('vi-VN') : '---';
            const tenNguoiNop = nop.tenNguoiNop || nop.nguoiNop;
            const cccd = nop.nguoiNop || '---';
            const canHo = nop.canHo || '---';
            const soTien = formatMoney(nop.soTien);
            
            tableRowsHTML += `
                <tr>
                    <td>${index + 1}</td>
                    <td>${canHo}</td>
                    <td>${tenNguoiNop}</td>
                    <td>${cccd}</td>
                    <td class="text-success font-weight-bold">${soTien}</td>
                    <td>${ngayNop}</td>
                </tr>
            `;
        });
    } else {
        tableRowsHTML = `
            <tr>
                <td colspan="6" style="text-align:center; padding:30px; color:#999; font-style:italic;">
                    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" style="margin-bottom:10px; opacity:0.5">
                       <circle cx="12" cy="12" r="10"></circle>
                       <line x1="12" y1="8" x2="12" y2="16"></line>
                       <line x1="8" y1="12" x2="16" y2="12"></line>
                    </svg>
                    <br>Chưa có dữ liệu nộp tiền
                </td>
            </tr>`;
    }

    card.innerHTML = `
        <div class="room-card-header ${headerClass}">
            <div style="flex: 1">
                <h3 class="room-card-title">${item.tenKhoanThu}</h3>
                <span class="${badgeClass}">${item.loaiKhoanThu}</span>
            </div>
            <div style="text-align: right">
                <div style="font-size: 0.8em; opacity: 0.9">Định mức</div>
                <div class="amount-badge">${formatMoney(item.soTien)}</div>
            </div>
        </div>

        <div class="room-card-body">
            <div class="mini-stats-row">
                <div class="mini-stat" style="align-items: flex-start;">
                    <span>Đã thu được</span>
                    <strong style="color:var(--success-color)">${formatMoney(item.stats.thucThu)}</strong>
                </div>
                <div class="mini-stat" style="align-items: flex-end;">
                    <span>Số hộ đã nộp</span>
                    <strong>${item.stats.soLuotNop} / ${item.tongSoHo || '---'}</strong>
                </div>
            </div>

            <button class="toggle-detail-btn" data-ma="${item.maKhoanThu}">
                <svg class="toggle-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
                <span class="toggle-text">Xem chi tiết</span>
            </button>

            <div class="detail-section" style="display: none;">
                <div class="detail-search-bar">
                    <input type="text" class="detail-search-input" placeholder="Tìm theo số căn hộ..." />
                </div>
                <div class="table-responsive">
                    <table class="payment-table">
                        <thead>
                            <tr>
                                <th style="width: 50px;">STT</th>
                                <th style="width: 150px;">Căn hộ</th>
                                <th>Người nộp</th>
                                <th>CCCD</th>
                                <th style="width: 200px;">Số tiền</th>
                                <th style="width: 180px;">Ngày nộp</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${tableRowsHTML}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        
        <div class="card-footer-actions">
            <button class="btn btn-outline btn-edit" data-ma="${item.maKhoanThu}">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
                Sửa
            </button>
            <button class="btn btn-primary btn-add-payment" data-ma="${item.maKhoanThu}">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                Nhập nộp tiền
            </button>
        </div>
    `;

    container.appendChild(card);
    
    // Add search functionality for detail table
    const searchInput = card.querySelector('.detail-search-input');
    const tableBody = card.querySelector('.payment-table tbody');
    
    if (searchInput && tableBody) {
        searchInput.addEventListener('input', (e) => {
            const searchValue = e.target.value.trim().toLowerCase();
            const rows = tableBody.querySelectorAll('tr');
            
            rows.forEach(row => {
                const canHoCell = row.cells[1]; // Cột căn hộ (index 1)
                if (canHoCell) {
                    const canHoText = canHoCell.textContent.toLowerCase();
                    if (canHoText.includes(searchValue)) {
                        row.style.display = '';
                    } else {
                        row.style.display = 'none';
                    }
                }
            });
        });
    }
    
    // Add toggle functionality
    const toggleBtn = card.querySelector('.toggle-detail-btn');
    const detailSection = card.querySelector('.detail-section');
    const toggleIcon = card.querySelector('.toggle-icon');
    const toggleText = card.querySelector('.toggle-text');
    
    if (toggleBtn && detailSection) {
        toggleBtn.addEventListener('click', () => {
            const isVisible = detailSection.style.display !== 'none';
            
            if (isVisible) {
                detailSection.style.display = 'none';
                card.style.height = '400px';
                toggleIcon.style.transform = 'rotate(0deg)';
                toggleText.textContent = 'Xem chi tiết';
            } else {
                detailSection.style.display = 'block';
                card.style.height = 'auto';
                toggleIcon.style.transform = 'rotate(180deg)';
                toggleText.textContent = 'Thu gọn';
            }
        });
    }
    
    // Add edit button functionality
    const btnEdit = card.querySelector('.btn-edit');
    if (btnEdit) {
        btnEdit.addEventListener('click', () => {
            openModal('edit', item);
        });
    }
    
    // Add payment button functionality
    const btnAddPayment = card.querySelector('.btn-add-payment');
    if (btnAddPayment) {
        btnAddPayment.addEventListener('click', () => {
            const maKhoanThu = btnAddPayment.getAttribute('data-ma');
            openNopTienModal(maKhoanThu);
        });
    }
}

// Event Listeners - Search and Filter
if(searchForm) {
    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const k = document.getElementById('keyword').value;
        const t = document.getElementById('filterType').value;
        loadAndRender(k, t);
    });
}

if(filterType) {
    filterType.addEventListener('change', (e) => {
        const k = document.getElementById('keyword').value;
        loadAndRender(k, e.target.value);
    });
}

// Khởi chạy
loadAndRender();