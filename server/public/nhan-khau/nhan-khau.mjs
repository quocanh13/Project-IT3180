import { getNhanKhauList, getNhanKhau, insertNhanKhau, updateNhanKhau,  deleteNhanKhau } from "../request/nhan-khau.mjs";

import createToast from "../utils/toast/toast.mjs";

let currentMode = 'add';

// 1. Khởi tạo khi load trang
document.addEventListener('DOMContentLoaded', () => {
    loadNhanKhauList();
    document.getElementById('nhanKhauForm')
        .addEventListener('submit', handleFormSubmit);
});

// 1.5 Hiển thị 1 hàng trong bảng
async function renderRow(nhanKhau) {
    const tbody = document.getElementById('nhanKhauData');
    const row = document.createElement('tr');

    let tenChuHo = '-';
    if (nhanKhau.hoKhau) {
        // nhanKhau.hoKhau là ObjectId, hoặc là object đã populate
        if (typeof nhanKhau.hoKhau === 'object' && nhanKhau.hoKhau.chuHo) {
            // Đã populate, lấy chuHo rồi lấy tên
            const resChuHo = await getNhanKhau(nhanKhau.hoKhau.chuHo);
            if (resChuHo && resChuHo.type === "OK" && resChuHo.data) {
                tenChuHo = resChuHo.data.hoTen;
            }
        }
        // Nếu chưa populate thì hiển thị ID
    }

    row.innerHTML = `
        <td>${nhanKhau.cccd}</td>
        <td>${nhanKhau.hoTen}</td>
        <td>${new Date(nhanKhau.ngaySinh).toLocaleDateString('vi-VN')}</td>
        <td>${nhanKhau.gioiTinh? 'Nam' : 'Nữ'}</td>
        <td>${tenChuHo}</td>
        <td>${nhanKhau.quanHeVoiChuHo || '-'}</td>
        <td>
            <button class="btn btn-primary" onclick="editNhanKhau('${nhanKhau.cccd}')">
                Sửa
            </button>
            <button class="btn btn-danger" onclick="removeNhanKhau('${nhanKhau.cccd}')">
                Xóa
            </button>
        </td>
    `;
    tbody.appendChild(row);
}

// 2. Lấy và hiển thị danh sách
async function loadNhanKhauList() {
    const tbody = document.getElementById('nhanKhauData');
    tbody.innerHTML = '<tr><td colspan="7">Đang tải dữ liệu...</td></tr>';

    const response = await getNhanKhauList(0, -1);

    if (response.type === "OK") {
        const nhanKhauList = response.data;
        console.log(nhanKhauList);

        tbody.innerHTML = '';
        for (const nhanKhau of nhanKhauList) {
            await renderRow(nhanKhau);
        }
    } else {
        createToast(response.message);
    }
}

// 3. Mở modal
window.openModal = function (mode, cccd = null) {
    currentMode = mode;

    const modal = document.getElementById('nhanKhauModal');
    const title = document.getElementById('modalTitle');
    const cccdInput = document.getElementById('cccd');
    const form = document.getElementById('nhanKhauForm');

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

// 4. Load chi tiết lên form
async function fetchDetailToForm(cccd) {
    const res = await getNhanKhau(cccd);

    if (res.type === "OK") {
        const nk = res.data;
        document.getElementById('cccd').value = nk.cccd;
        document.getElementById('hoTen').value = nk.hoTen;
        document.getElementById('ngaySinh').value =
            new Date(nk.ngaySinh).toISOString().split('T')[0];
        document.getElementById('gioiTinh').value = nk.gioiTinh ? "1" : "0";
        document.getElementById('quocTich').value = nk.quocTich;
        document.getElementById('danToc').value = nk.danToc;
        document.getElementById('queQuan').value = nk.queQuan;
        document.getElementById('noiSinh').value = nk.noiSinh;
    }
}

// 5. Đóng modal
window.closeModal = function () {
    document.getElementById('nhanKhauModal').style.display = 'none';
};

// 6. Submit form (Thêm / Sửa)
async function handleFormSubmit(e) {
    e.preventDefault();

    const nhanKhauObj = {
        cccd: document.getElementById('cccd').value,
        hoTen: document.getElementById('hoTen').value,
        ngaySinh: new Date(document.getElementById('ngaySinh').value),
        gioiTinh: Number(document.getElementById('gioiTinh').value),
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
        createToast(res.message, false);
        closeModal();
        loadNhanKhauList();
    } else {
        createToast(res.message);
    }
}

// 7. Xóa
window.removeNhanKhau = async function (cccd) {
    if (confirm(`Bạn có chắc muốn xóa nhân khẩu: ${cccd}?`)) {
        const res = await deleteNhanKhau(cccd);
        if (res.type === "OK") {
            loadNhanKhauList();
        } else {
            createToast(res.message);
        }
    }
};

// 8. Edit
window.editNhanKhau = function (cccd) {
    openModal('edit', cccd);
};
