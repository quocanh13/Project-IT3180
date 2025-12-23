import { getHoKhauList, getHoKhau, insertHoKhau, updateHoKhau, deleteHoKhau, addThanhVien } from "../request/ho-khau.mjs";
import { getNhanKhauList, getNhanKhau, deleteNhanKhau, updateNhanKhau, insertNhanKhau } from "../request/nhan-khau.mjs";
import createToast from "../utils/toast/toast.mjs";
import createHoKhauDetail from "./ho-khau-detail.mjs"

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
                // Lấy tên chủ hộ
                const chuHoRes = await getNhanKhau(cccd);
                const tenChuHo = chuHoRes.type === "OK" ? chuHoRes.data.hoTen : "Không xác định";
                renderRow(detailRes.data, tenChuHo);
            }
        }
    } else {
        createToast(response.message);
    }
}

function renderRow(hoKhau, tenChuHo) {
    const tbody = document.getElementById('hoKhauData');
    const row = document.createElement('tr');
    row.className = "member-row"
    row.addEventListener("click", async ()=>{
        const _hoKhau = await getHoKhauInformation(hoKhau)
        if(_hoKhau != null) {
            createHoKhauDetail(_hoKhau)
        }
    });
    row.innerHTML = `
        <td>${tenChuHo}</td>
        <td>${hoKhau.chuHo}</td>
        <td>${hoKhau.soNha}</td>
        <td>${new Date(hoKhau.ngayDK).toLocaleDateString('vi-VN')}</td>
        <td>${hoKhau.thanhVien ? hoKhau.thanhVien.length : 0}</td>
        <td>
            <button class="btn btn-primary" onclick="editHoKhau('${hoKhau.chuHo}'); event.stopPropagation();">Sửa</button>
            <button class="btn btn-danger" onclick="removeHoKhau('${hoKhau.chuHo}'); event.stopPropagation();">Xóa</button>
            <button class="btn btn-success" onclick="window.addThanhVien('${hoKhau.chuHo}'); event.stopPropagation();">Thêm thành viên</button>
        </td>
    `;
    tbody.appendChild(row);
}

// 2. Thêm và Sửa
async function handleFormSubmit(e) {
    e.preventDefault();
    
    const hoKhauObj = {
        chuHo: document.getElementById('chuHo').value,
        soNha: document.getElementById('soNha').value,
        ngayDK: new Date(document.getElementById('ngayDK').value),
        thanhVien: [] // Mặc định khi thêm mới chưa có thành viên
    };
    let res;
    if (currentMode === 'add') {
        res = await insertHoKhau(hoKhauObj);
    } else {
        res = await updateHoKhau(hoKhauObj);
    }

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
        const hoKhauRes = await getHoKhau(cccd);
        if (hoKhauRes.type !== "OK") {
            createToast("Hộ khẩu không tồn tại");
        } else if (hoKhauRes.data.thanhVien) {
            hoKhauRes.data.thanhVien.forEach(async (memberCCCD) => {
                await deleteNhanKhau(memberCCCD);
            });
        }
        const res = await deleteHoKhau(cccd);
        if (res.type === "OK") {
            loadHoKhauList();
        } else {
            loadHoKhauList();
        }
    }
}

// 4. Quản lý Modal
window.openModal = async function(mode, cccd = null) {
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
        chuHoInput.disabled = true; // Không cho sửa CCCD chủ hộ khi update
        fetchDetailToForm(cccd);
    } else {
        title.innerText = "Thêm Hộ Khẩu";
        chuHoInput.disabled = false;
    }
}

async function fetchDetailToForm(cccd) {
    const res = await getHoKhau(cccd);
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

window.addThanhVien = async function(chuHo) {
    const cccd = prompt('Nhập số CCCD thành viên:');
    if (cccd) {
        const res = await addThanhVien(chuHo, cccd);
        if (res.type === "OK") {
            createToast('Thêm thành viên thành công', false);
            loadHoKhauList();
        } else {
            createToast(res.message);
        }
    }
}

/**
 * @param {HoKhau} _hoKhau 
 */
async function getHoKhauInformation(_hoKhau) {
    const hoKhau = Object.create(_hoKhau)
    hoKhau.thanhVien = []
    const chuHo = await getNhanKhau(hoKhau.chuHo)
    if(chuHo.type == "OK") {
        hoKhau.chuHo = chuHo.data
    } else {
        createToast(chuHo.message)
        return null
    }

    for(let i = 0; i < _hoKhau.thanhVien.length; i++) {
        const thanhVien = await getNhanKhau(_hoKhau.thanhVien[i])
        if(thanhVien.type == "OK") {
            hoKhau.thanhVien.push(thanhVien.data)
        } else {
            createToast(thanhVien.message)
            return null
        }
    }
    return hoKhau;   
}