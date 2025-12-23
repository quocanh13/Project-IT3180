import { getNhanKhauList, getNhanKhau, insertNhanKhau, updateNhanKhau, deleteNhanKhau } from "../request/nhan-khau.mjs";

import createToast from "../utils/toast/toast.mjs";

let currentMode = 'add';

// 1. Khởi tạo khi load trang
document.addEventListener('DOMContentLoaded', () => {
    loadNhanKhauList();
    // Gán sự kiện submit form
    document.getElementById('nhanKhauForm').addEventListener('submit', handleFormSubmit);
});

// 1.5 Hiển thị hàng trong bảng
function renderRow(nhanKhau) {
    const tbody = document.getElementById('nhanKhauData');
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${nhanKhau.cccd}</td>
        <td>${nhanKhau.hoTen}</td>
        <td>${new Date(nhanKhau.ngaySinh).toLocaleDateString('vi-VN')}</td>
        <td>${nhanKhau.gioiTinh ? 'Nam' : 'Nữ'}</td>
        <td>${nhanKhau.chuHo || '-'}</td>
        <td>${nhanKhau.quanHeVoiChuHo || '-'}</td>
        <td>
            <button class="btn btn-primary" onclick="editNhanKhau('${nhanKhau.cccd}')">Sửa</button>
            <button class="btn btn-danger" onclick="removeNhanKhau('${nhanKhau.cccd}')">Xóa</button>
        </td>
    `;
    tbody.appendChild(row);
}
// 2. Lấy và hiển thị danh sách
async function loadNhanKhauList() {
    const tbody = document.getElementById('nhanKhauData');
    tbody.innerHTML = '<tr><td colspan="5">Đang tải dữ liệu...</td></tr>';

    const response = await getNhanKhauList(0, -1);
    
    if (response.type === "OK") {
        const nhanKhauList = response.data;
        console.log(nhanKhauList);
        tbody.innerHTML = ''; // Xóa dữ liệu cũ

        for (const nhanKhau of nhanKhauList) {
            renderRow(nhanKhau);
        }
    } else {
        createToast(response.message);
    }
}
// 3.Gán vào window để HTML onclick có thể gọi được
window.openModal = function(mode, cccd = null) {
    currentMode = mode;
    const modal = document.getElementById('nhanKhauModal');
    const title = document.getElementById('modalTitle');
    const cccdInput = document.getElementById('cccd');
    const form = document.getElementById('nhanKhauForm');

    if (!modal || !title) {
        return;
    }

    // Hiển thị modal trước để các thay đổi bên dưới có thể nhìn thấy
    modal.style.display = 'flex';
    form.reset();

    if (mode === 'edit') {
        title.innerText = "Chỉnh sửa Nhân Khẩu";
        cccdInput.disabled = true; 
        fetchDetailToForm(cccd);
    } else {
        title.innerText = "Thêm Nhân Khẩu";
        cccdInput.disabled = false;
    }
};

async function fetchDetailToForm(cccd) {
    const res = await getNhanKhau(Number(cccd));
    if (res.type === "OK") {
        document.getElementById('cccd').value = res.data.cccd;
        document.getElementById('hoTen').value = res.data.hoTen;
        document.getElementById('ngaySinh').value = new Date(res.data.ngaySinh).toISOString().split('T')[0];
        document.getElementById('gioiTinh').value = res.data.gioiTinh ? "1" : "0";
        document.getElementById('quocTich').value = res.data.quocTich;
        document.getElementById('danToc').value = res.data.danToc;
        document.getElementById('queQuan').value = res.data.queQuan;
        document.getElementById('noiSinh').value = res.data.noiSinh;
    }
}

// 4. Hàm đóng modal
window.closeModal = function() {
    const modal = document.getElementById('nhanKhauModal');
    modal.style.display = 'none';
};
// 5. Thêm và Sửa
async function handleFormSubmit(e) {
    e.preventDefault();
    
    const nhanKhauObj = {
        cccd: document.getElementById('cccd').value,
        hoTen: document.getElementById('hoTen').value,
        ngaySinh: new Date(document.getElementById('ngaySinh').value),
        gioiTinh: document.getElementById('gioiTinh').value,
        quocTich: document.getElementById('quocTich').value,
        danToc: document.getElementById('danToc').value,
        queQuan: document.getElementById('queQuan').value,
        noiSinh: document.getElementById('noiSinh').value
    };

    let res;
    if (currentMode === 'add') {
        res = await insertNhanKhau(nhanKhauObj);
    } else {
        res = await updateNhanKhau(nhanKhauObj);
    }

    if (res.type === "OK") {
        createToast(res.message, false)
        closeModal();
        loadNhanKhauList();
    } else {
        createToast(res.message);
    }
}

// 6. Xóa
window.removeNhanKhau = async function(cccd) {
    if (confirm(`Bạn có chắc muốn xóa nhân khẩu: ${cccd}?`)) {
        const res = await deleteNhanKhau(Number(cccd));
        if (res.type === "OK") {
            loadNhanKhauList();
        } else {
            createToast(res.message);
        }
    }
}

// 7. Edit
window.editNhanKhau = function(cccd) {
    openModal('edit', cccd);
}