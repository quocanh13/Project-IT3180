import { getHoKhauList, getHoKhau, insertHoKhau, updateHoKhau, deleteHoKhau, addThanhVien } from "../request/ho-khau.mjs";
import { getNhanKhauList, getNhanKhau, deleteNhanKhau, updateNhanKhau, insertNhanKhau } from "../request/nhan-khau.mjs";
import createToast from "../utils/toast/toast.mjs"
import {createHoKhauDetail} from "./ho-khau-detail.mjs"


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
        const list_id = response.data;
        tbody.innerHTML = ''; // Xóa dữ liệu cũ

        for (const _id of list_id) {
            const detailRes = await getHoKhau(_id);
            if (detailRes.type === "OK") {
                const hoKhauGoc = detailRes.data;

                // Lấy tên chủ hộ
                const chuHoRes = await getNhanKhau(hoKhauGoc.chuHo);

                // Tạo đối tượng mới kế thừa toàn bộ hoKhauGoc và thêm tên chủ hộ
                const hoKhauInformation = {
                    ...hoKhauGoc,
                    tenChuHo: chuHoRes.data ? chuHoRes.data.hoTen : 'N/A'
                };
                console.log('HoKhauFull:', hoKhauInformation);
                renderRow(hoKhauInformation);
            }
        }
    } else {
        createToast(response.message);
    }
}

function renderRow(hoKhauFull) {
    const tbody = document.getElementById('hoKhauData');
    const row = document.createElement('tr');
    
    row.onclick = (e) => {
        if (e.target.tagName === 'BUTTON') return;
        
        createHoKhauDetail(hoKhauFull); 
    };
    
    row.innerHTML = `
        <td>${hoKhauFull.tenChuHo}</td>
        <td>${hoKhauFull.chuHo}</td>
        <td>${hoKhauFull.canHo}</td>
        <td>${new Date(hoKhauFull.ngayDK).toLocaleDateString('vi-VN')}</td>
        <td>${hoKhauFull.thanhVien.length || 0}</td>
        <td>
            <button class="btn btn-primary" onclick="editHoKhau('${hoKhauFull._id}')">Sửa</button>
            <button class="btn btn-danger" onclick="removeHoKhau('${hoKhauFull._id}')">Xóa</button>
            <button class="btn btn-success" onclick="window.addThanhVien('${hoKhauFull._id}')">Thêm thành viên</button>
        </td>
    `;
    tbody.appendChild(row);
}

// 2. Thêm và Sửa
async function handleFormSubmit(e) {
    e.preventDefault();
    
    const hoKhauObj = {
        chuHo: document.getElementById('chuHo').value,
        canHo: Number(document.getElementById('canHo').value),
        ngayDK: new Date(document.getElementById('ngayDK').value),
    };
    
    // Nếu là edit, thêm _id
    if (currentMode === 'edit') {
        hoKhauObj._id = document.getElementById('hoKhauId').value;
    }

    let res;
    if (currentMode === 'add') {
        res = await insertHoKhau(hoKhauObj);
        if (res.type === "OK" && res.data && res.data._id) {
            await addThanhVien(res.data._id, hoKhauObj.chuHo);
        }
    } else {
        res = await updateHoKhau(hoKhauObj);
    }

    if (res && res.type === "OK") {
        createToast(res.message || 'Thành công', false);
        closeModal();
        loadHoKhauList();
    } else {
        createToast(res?.message || 'Có lỗi xảy ra');
    }
}

// 3. Xóa
window.removeHoKhau = async function(_id) {
    if (confirm(`Bạn có chắc muốn xóa hộ khẩu này?`)) { 
        const hoKhauRes = await getHoKhau(_id);
        if (hoKhauRes.type !== "OK") {
            createToast("Hộ khẩu không tồn tại");
        } else if (hoKhauRes.data.thanhVien) {
            hoKhauRes.data.thanhVien.forEach(async (memberCCCD) => {
                await deleteNhanKhau(memberCCCD);
            });
        }
        const res = await deleteHoKhau(_id);
        if (res.type === "OK") {
            loadHoKhauList();
        } else {
            loadHoKhauList();
        }
    }
}

// 4. Quản lý Modal
window.openModal = async function(mode, _id = null) {
    currentMode = mode;
    const modal = document.getElementById('hoKhauModal');
    const title = document.getElementById('modalTitle');
    const chuHoInput = document.getElementById('chuHo');
    
    modal.style.display = 'flex';
    document.getElementById('hoKhauForm').reset();
    
    // Load danh sách nhân khẩu vào dropdown
    await loadNhanKhauToDropdown();

    if (mode === 'edit') {
        title.innerText = "Chỉnh sửa Hộ Khẩu";
        chuHoInput.disabled = false; // Cho phép sửa chủ hộ
        fetchDetailToForm(_id);
    } else {
        title.innerText = "Thêm Hộ Khẩu";
        chuHoInput.disabled = false;
    }
}

async function fetchDetailToForm(_id) {
    const res = await getHoKhau(_id);
    if (res.type === "OK") {
        document.getElementById('hoKhauId').value = res.data._id;
        document.getElementById('chuHo').value = res.data.chuHo;
        document.getElementById('canHo').value = res.data.canHo;
        document.getElementById('ngayDK').value = new Date(res.data.ngayDK).toISOString().split('T')[0];
    }
}

window.closeModal = function() {
    document.getElementById('hoKhauModal').style.display = 'none';
}

window.editHoKhau = function(_id) {
    openModal('edit', _id);
}

// Load danh sách nhân khẩu vào dropdown
async function loadNhanKhauToDropdown() {
    const chuHoSelect = document.getElementById('chuHo');
    chuHoSelect.innerHTML = '<option value="" disabled selected>Chọn Chủ Hộ</option>';
    
    try {
        const response = await getNhanKhauList(0, -1);
        console.log('Response from getNhanKhauList:', response);
        
        if (response.type === "OK") {
            const listNhanKhau = response.data; // Đây là array of full objects, không phải array of CCCD
            console.log('Danh sách nhân khẩu:', listNhanKhau);
            
            if (!listNhanKhau || listNhanKhau.length === 0) {
                chuHoSelect.innerHTML += '<option value="" disabled>Chưa có nhân khẩu nào</option>';
                createToast('Vui lòng thêm nhân khẩu trước khi tạo hộ khẩu', true);
                return;
            }
            
            // Duyệt qua từng nhân khẩu và thêm vào dropdown
            for (const nhanKhau of listNhanKhau) {
                const option = document.createElement('option');
                option.value = nhanKhau.cccd;
                option.textContent = `${nhanKhau.hoTen} - ${nhanKhau.cccd}`;
                chuHoSelect.appendChild(option);
            }
            console.log('Đã load xong dropdown');
        } else {
            console.error('Lỗi khi lấy danh sách:', response);
            createToast(response.message || 'Không thể tải danh sách nhân khẩu');
            chuHoSelect.innerHTML += '<option value="" disabled>Lỗi tải dữ liệu</option>';
        }
    } catch (error) {
        console.error('Exception khi load nhân khẩu:', error);
        createToast('Lỗi khi tải danh sách nhân khẩu');
        chuHoSelect.innerHTML += '<option value="" disabled>Lỗi tải dữ liệu</option>';
    }
}

window.addThanhVien = async function(_id) {
    const cccd = prompt('Nhập số CCCD thành viên:');
    if (cccd) {
        const res = await addThanhVien(_id, cccd);
        if (res.type === "OK") {
            createToast('Thêm thành viên thành công', false);
            loadHoKhauList();
        } else {
            createToast(res.message);
        }
    }
}