import { getHoKhauList, getHoKhau, insertHoKhau, updateHoKhau, deleteHoKhau } from "../request/ho-khau.mjs";
import createToast from "../utils/toast/toast.mjs";

let currentMode = 'add';

// Khởi tạo khi load trang
document.addEventListener('DOMContentLoaded', () => {
    loadHoKhauList();
    
    // Gán sự kiện submit form
    document.getElementById('hoKhauForm').addEventListener('submit', handleFormSubmit);
});

// 1. Lấy và hiển thị danh sách
async function loadHoKhauList() {
    const tbody = document.getElementById('hoKhauData');
    tbody.innerHTML = '<tr><td colspan="5">Đang tải dữ liệu...</td></tr>';

    const response = await getHoKhauList(0, -1);
    
    if (response.type === "OK") {
        const listCCCD = response.data;
        tbody.innerHTML = ''; // Xóa dữ liệu cũ

        for (const cccd of listCCCD) {
            const detailRes = await getHoKhau(cccd);
            if (detailRes.type === "OK") {
                renderRow(detailRes.data);
            }
        }
    } else {
        createToast(response.message);
    }
}

function renderRow(hoKhau) {
    const tbody = document.getElementById('hoKhauData');
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${hoKhau.chuHo}</td>
        <td>${hoKhau.soNha}</td>
        <td>${new Date(hoKhau.ngayDK).toLocaleDateString('vi-VN')}</td>
        <td>${hoKhau.thanhVien ? hoKhau.thanhVien.length : 0}</td>
        <td>
            <button class="btn btn-primary" onclick="editHoKhau('${hoKhau.chuHo}')">Sửa</button>
            <button class="btn btn-danger" onclick="removeHoKhau('${hoKhau.chuHo}')">Xóa</button>
        </td>
    `;
    tbody.appendChild(row);
}

// 2. Thêm và Sửa
async function handleFormSubmit(e) {
    e.preventDefault();
    console.log("Form submit được kích hoạt");
    
    const hoKhauObj = {
        chuHo: document.getElementById('chuHo').value,
        soNha: document.getElementById('soNha').value,
        ngayDK: new Date(document.getElementById('ngayDK').value),
        thanhVien: [] // Mặc định khi thêm mới chưa có thành viên
    };

    console.log("Dữ liệu gửi:", hoKhauObj);

    let res;
    if (currentMode === 'add') {
        console.log("Mode: Thêm mới");
        res = await insertHoKhau(hoKhauObj);
    } else {
        console.log("Mode: Cập nhật");
        res = await updateHoKhau(hoKhauObj);
    }

    console.log("Phản hồi từ server:", res);

    if (res.type === "OK") {
        createToast(res.message, false)
        closeModal();
        loadHoKhauList();
    } else {
        createToast(res.message);
    }
}

// 3. Xóa
window.removeHoKhau = async function(cccd) {
    if (confirm(`Bạn có chắc muốn xóa hộ khẩu chủ hộ: ${cccd}?`)) {
        const res = await deleteHoKhau(Number(cccd));
        if (res.type === "OK") {
            loadHoKhauList();
        } else {
            
        }
    }
}

// 4. Quản lý Modal
window.openModal = function(mode, cccd = null) {
    currentMode = mode;
    const modal = document.getElementById('hoKhauModal');
    const title = document.getElementById('modalTitle');
    const chuHoInput = document.getElementById('chuHo');
    
    modal.style.display = 'flex';
    document.getElementById('hoKhauForm').reset();

    if (mode === 'edit') {
        title.innerText = "Chỉnh sửa Hộ Khẩu";
        chuHoInput.disabled = true; // Không cho sửa CCCD chủ hộ khi update
        fetchDetailToForm(cccd);
    } else {
        title.innerText = "Thêm Hộ Khẩu";
        chuHoInput.disabled = false;
    }
}

async function fetchDetailToForm(cccd) {
    const res = await getHoKhau(Number(cccd));
    if (res.type === "OK") {
        document.getElementById('chuHo').value = res.data.chuHo;
        document.getElementById('soNha').value = res.data.soNha;
        document.getElementById('ngayDK').value = new Date(res.data.ngayDK).toISOString().split('T')[0];
    }
}

window.closeModal = function() {
    document.getElementById('hoKhauModal').style.display = 'none';
}

window.editHoKhau = function(cccd) {
    openModal('edit', cccd);
}