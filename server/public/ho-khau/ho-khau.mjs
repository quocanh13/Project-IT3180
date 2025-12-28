import { getHoKhauList, getHoKhau, insertHoKhau, updateHoKhau, deleteHoKhau, addThanhVien, deleteThanhVien, searchHoKhau} from "../request/ho-khau.mjs";
import { getNhanKhauList, getNhanKhau, deleteNhanKhau, updateNhanKhau, insertNhanKhau } from "../request/nhan-khau.mjs";
import createToast from "../utils/toast/toast.mjs"
// import { renderLayout } from "../utils/layout.mjs"
import createHeader from "../header/header.mjs"

createHeader(0);

let currentMode = 'add';

// Khởi tạo khi load trang
document.addEventListener('DOMContentLoaded', () => {
    // Render layout (topbar + sidebar)
    // renderLayout('ho-khau');
    
    loadHoKhauList();
    
    // Gán sự kiện submit form
    document.getElementById('hoKhauForm').addEventListener('submit', handleFormSubmit);
});

// 1. Lấy và hiển thị danh sách
async function loadHoKhauList() {
    const tbody = document.getElementById('hoKhauData');
    const totalHoKhau = document.querySelector("#totalHoKhau.stat-value")
    const totalMembers = document.querySelector("#totalMembers.stat-value")
    const totalApartments = document.querySelector("#totalApartments.stat-value")
    const tableCount = document.querySelector("#tableCount.table-count")
    tbody.innerHTML = '<tr><td colspan="5">Đang tải dữ liệu...</td></tr>';

    const response = await getHoKhauList(0, -1);
    
    if (response.type === "OK") {
        let countTotalMember = 0
        const list_id = response.data;
        totalHoKhau.textContent = list_id.length
        totalApartments.textContent = list_id.length
        tableCount.textContent = list_id.length + " Hộ Khẩu"
        tbody.innerHTML = ''; // Xóa dữ liệu cũ

        for (const _id of list_id) {
            const detailRes = await getHoKhau(_id);
            if (detailRes.type === "OK") {
                const hoKhauGoc = detailRes.data;
                countTotalMember += hoKhauGoc.thanhVien.length
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

        totalMembers.textContent = countTotalMember
    } else {
        createToast(response.message);
    }
}

function renderRow(hoKhauFull) {
    const tbody = document.getElementById('hoKhauData');
    const row = document.createElement('tr');
    
    row.onclick = (e) => {
        if (e.target.tagName === 'BUTTON') return;
        
        // Mở modal detail mới
        openDetailModal(hoKhauFull._id);
    };
    
    row.innerHTML = `
        <td>${hoKhauFull.tenChuHo}</td>
        <td>${hoKhauFull.chuHo}</td>
        <td>${hoKhauFull.canHo}</td>
        <td>${new Date(hoKhauFull.ngayDK).toLocaleDateString('vi-VN')}</td>
        <td>${hoKhauFull.thanhVien.length || 0}</td>
        <td>
            <button class="btn btn-warning" onclick="editHoKhau('${hoKhauFull._id}')">Sửa</button>
            <button class="btn btn-danger" onclick="removeHoKhau('${hoKhauFull._id}')">Xóa</button>
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
    };
    
    if (currentMode === 'edit') {
        hoKhauObj._id = document.getElementById('hoKhauId').value;
    } else {
        hoKhauObj.ngayDK = new Date(document.getElementById('ngayDK').value);
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
    const ngayDKInput = document.getElementById('ngayDK');
    
    modal.style.display = 'flex';
    document.getElementById('hoKhauForm').reset();
    
    // Load danh sách nhân khẩu vào dropdown
    await loadNhanKhauToDropdown();

    if (mode === 'edit') {
        title.innerText = "Chỉnh sửa Hộ Khẩu";
        chuHoInput.disabled = false; // Cho phép sửa chủ hộ
        ngayDKInput.disabled = true; // Khóa ngày đăng ký khi edit
        fetchDetailToForm(_id);
    } else {
        title.innerText = "Thêm Hộ Khẩu";
        chuHoInput.disabled = false;
        ngayDKInput.disabled = false; // Cho phép nhập ngày đăng ký khi thêm mới
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

// ===== DETAIL MODAL FUNCTIONS =====
let currentHoKhauId = null;

async function openDetailModal(hoKhauId) {
    currentHoKhauId = hoKhauId;
    const modal = document.getElementById('detailModal');
    
    // Load dữ liệu hộ khẩu
    const res = await getHoKhau(hoKhauId);
    if (res.type !== "OK") {
        createToast('Không thể tải thông tin hộ khẩu');
        return;
    }
    
    const hoKhau = res.data;
    
    // Lấy thông tin chủ hộ
    const chuHoRes = await getNhanKhau(hoKhau.chuHo);
    const tenChuHo = chuHoRes.data ? chuHoRes.data.hoTen : 'N/A';
    
    // Hiển thị thông tin cơ bản
    document.getElementById('detailTenChuHo').textContent = tenChuHo;
    document.getElementById('detailCCCDChuHo').textContent = hoKhau.chuHo;
    document.getElementById('detailCanHo').textContent = hoKhau.canHo || 'N/A';
    document.getElementById('detailNgayDK').textContent = new Date(hoKhau.ngayDK).toLocaleDateString('vi-VN');
    document.getElementById('detailSoThanhVien').textContent = hoKhau.thanhVien?.length || 0;
    
    // Load danh sách thành viên
    await loadMembersList(hoKhau.thanhVien);
    
    modal.style.display = 'flex';
}

window.closeDetailModal = function() {
    document.getElementById('detailModal').style.display = 'none';
    currentHoKhauId = null;
}

async function loadMembersList(thanhVienArray) {
    const tbody = document.getElementById('membersTableBody');
    tbody.innerHTML = '<tr><td colspan="5">Đang tải...</td></tr>';
    
    if (!thanhVienArray || thanhVienArray.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: #999;">Chưa có thành viên nào</td></tr>';
        return;
    }
    
    tbody.innerHTML = '';
    
    for (const member of thanhVienArray) {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${member.hoTen || 'N/A'}</td>
            <td>${member.cccd || 'N/A'}</td>
            <td>${member.quanHeVoiChuHo || 'N/A'}</td>
            <td>${member.ngaySinh ? new Date(member.ngaySinh).toLocaleDateString('vi-VN') : 'N/A'}</td>
            <td>
                <div style="display: flex; gap: 8px; justify-content: center;">
                    <button class="btn-edit-member" onclick="openUpdateRelationModal('${member.cccd}', '${member.hoTen}', '${member.quanHeVoiChuHo || ''}')">Sửa</button>
                    <button class="btn-delete-member" onclick="removeMemberFromHo('${member.cccd}')">Xóa</button>
                </div>
            </td>
        `;
        
        tbody.appendChild(row);
    }
}

window.openAddMemberModal = async function() {
    const modal = document.getElementById('addMemberModal');
    const select = document.getElementById('memberSelect');
    
    // Load danh sách nhân khẩu
    select.innerHTML = '<option value="" disabled selected>Đang tải...</option>';
    
    const res = await getNhanKhauList(0, -1);
    if (res.type === "OK") {
        select.innerHTML = '<option value="" disabled selected>-- Chọn nhân khẩu --</option>';
        
        for (const nhanKhau of res.data) {
            const option = document.createElement('option');
            option.value = nhanKhau.cccd;
            option.textContent = `${nhanKhau.hoTen} - ${nhanKhau.cccd}`;
            select.appendChild(option);
        }
    } else {
        select.innerHTML = '<option value="" disabled>Lỗi tải dữ liệu</option>';
    }
    
    modal.style.display = 'flex';
}

window.closeAddMemberModal = function() {
    document.getElementById('addMemberModal').style.display = 'none';
    document.getElementById('addMemberForm').reset();
}

// Xử lý form thêm thành viên
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('addMemberForm')?.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const cccd = document.getElementById('memberSelect').value;
        const quanHe = document.getElementById('quanHeVoiChuHo').value;
        
        if (!currentHoKhauId || !cccd) {
            createToast('Thông tin không hợp lệ');
            return;
        }
        
        // Thêm thành viên vào hộ
        const res = await addThanhVien(currentHoKhauId, cccd);
        
        if (res.type === "OK") {
            // Cập nhật quan hệ với chủ hộ
            const updateRes = await updateNhanKhau({
                cccd: cccd,
                quanHeVoiChuHo: quanHe
            });
            
            createToast('Thêm thành viên thành công', false);
            closeAddMemberModal();
            // Refresh detail modal
            openDetailModal(currentHoKhauId);
            loadHoKhauList();
        } else {
            createToast(res.message || 'Không thể thêm thành viên');
        }
    });
    
    // Xử lý form cập nhật quan hệ
    document.getElementById('updateRelationForm')?.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const cccd = document.getElementById('updateMemberCCCD').value;
        const quanHe = document.getElementById('updateQuanHe').value;
        
        if (!cccd || !quanHe) {
            createToast('Thông tin không hợp lệ');
            return;
        }
        
        const res = await updateNhanKhau({
            cccd: cccd,
            quanHeVoiChuHo: quanHe
        });
        
        if (res.type === "OK") {
            createToast('Cập nhật quan hệ thành công', false);
            closeUpdateRelationModal();
            // Refresh detail modal
            if (currentHoKhauId) {
                openDetailModal(currentHoKhauId);
            }
            loadHoKhauList();
        } else {
            createToast(res.message || 'Không thể cập nhật quan hệ');
        }
    });
});

window.removeMemberFromHo = async function(cccd) {
    if (!confirm('Bạn có chắc muốn xóa thành viên này khỏi hộ?')) {
        return;
    }
    
    const res = await deleteThanhVien(currentHoKhauId, cccd);
    
    if (res.type === "OK") {
        createToast('Đã xóa thành viên', false);
        // Refresh detail modal
        if (currentHoKhauId) {
            openDetailModal(currentHoKhauId);
        }
        loadHoKhauList();
    } else {
        createToast(res.message || 'Không thể xóa thành viên');
    }
}

// Mở modal cập nhật quan hệ
window.openUpdateRelationModal = function(cccd, hoTen, quanHe) {
    document.getElementById('updateMemberCCCD').value = cccd;
    document.getElementById('updateMemberName').value = hoTen;
    document.getElementById('updateQuanHe').value = quanHe || '';
    document.getElementById('updateRelationModal').style.display = 'flex';
}

window.closeUpdateRelationModal = function() {
    document.getElementById('updateRelationModal').style.display = 'none';
    document.getElementById('updateRelationForm').reset();
}

window.openDetailModal = openDetailModal;

// Tìm kiếm hộ khẩu 
const searchForm = document.getElementById('searchForm');
if (searchForm) {
    searchForm.addEventListener('submit', async (e) => {   
        e.preventDefault();

        const keyword = document.getElementById('keyword').value.trim();
        const tbody = document.getElementById('hoKhauData');

        if (!keyword) {
            loadHoKhauList();
            return;
        }

        tbody.innerHTML = '<tr><td colspan="5">Đang tải dữ liệu...</td></tr>';
        const response = await searchHoKhau(keyword);

        if (response.type === "OK") {
            const listId = response.data;
            tbody.innerHTML = ''; 
            for (const id of listId) {
                const detailRes = await getHoKhau(id); 
                if (detailRes.type === "OK") {
                    const hoKhauGoc = detailRes.data;
                    const chuHoRes = await getNhanKhau(hoKhauGoc.chuHo); 
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
    });
}


// Lọc hộ khẩu
const filterSelect = document.getElementById('filterSelect');
if (filterSelect) {
    filterSelect.addEventListener('change', async (e) => {
        const filterValue = e.target.value;
        const tbody = document.getElementById('hoKhauData');
        tbody.innerHTML = '<tr><td colspan="5">Đang tải dữ liệu...</td></tr>';  
        let response;
        if (filterValue === 'asc' || filterValue === 'desc') {
            response = await getHoKhauList(0, -1, filterValue);
        } else {
            response = await getHoKhauList(0, -1,null);
        } 
        if (response.type === "OK") {
            const list_id = response.data;
            tbody.innerHTML = '';
            for (const _id of list_id) {
                const detailRes = await getHoKhau(_id);
                if (detailRes.type === "OK") {
                    const hoKhauGoc = detailRes.data;
                    const chuHoRes = await getNhanKhau(hoKhauGoc.chuHo);
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
    });
}