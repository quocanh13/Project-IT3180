import { renderLayout } from "../utils/layout.mjs";

// Render layout khi load trang
document.addEventListener('DOMContentLoaded', () => {
    renderLayout('khoan-thu');
});

let currentMode = 'add';
let currentId = null;

// Hàm mở Modal
window.openModal = async function(mode, _id = null) {
    currentMode = mode;
    currentId = _id;
    
    const modal = document.getElementById('khoanThuModal');
    const title = document.getElementById('modalTitle');
    const form = document.getElementById('khoanThuForm');
    
    if (!modal) return;

    modal.style.display = 'flex';
    form.reset();
    
    if (mode === 'edit') {
        title.innerText = "Chỉnh sửa Khoản Thu";
        // Giả sử bạn đã có hàm fetchDetailToForm định nghĩa ở dưới
        if (typeof fetchDetailToForm === 'function') {
            await fetchDetailToForm(_id);
        }
    } else {
        title.innerText = "Thêm Khoản Thu";
    }
}

// Hàm đóng Modal
window.closeModal = function() {
    const modal = document.getElementById('khoanThuModal');
    if (modal) modal.style.display = 'none';
}

// Xử lý submit form
document.getElementById('khoanThuForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = {
        ten: document.getElementById('tenKhoanThu').value,
        loai: document.getElementById('loaiKhoanThu').value,
        soTien: document.getElementById('soTien').value
    };
    
    window.closeModal();
});
// Đóng Modal khi click bên ngoài nội dung
window.onclick = function(event) {
    const modal = document.getElementById('khoanThuModal');
    if (event.target == modal) {
        window.closeModal();
    }
}