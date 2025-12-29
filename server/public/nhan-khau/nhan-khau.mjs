import { getNhanKhauList, getNhanKhau, insertNhanKhau, updateNhanKhau,  deleteNhanKhau, searchNhanKhau, filterNhanKhau  } from "../request/nhan-khau.mjs";
import createToast from "../utils/toast/toast.mjs";
import createHeader from "../header/header.mjs"

let currentMode = 'add';

createHeader(1)

// 1. Khởi tạo khi load trang
document.addEventListener('DOMContentLoaded', () => {
    // Render layout (topbar + sidebar)
    
    loadNhanKhauList();
    document.getElementById('nhanKhauForm')
        .addEventListener('submit', handleFormSubmit);
});

// 1.5 Hiển thị 1 hàng trong bảng
async function renderRow(nhanKhau) {
    const tbody = document.getElementById('nhanKhauData');
    const row = document.createElement('tr');

    let tenChuHo = '-';
    let canHo = '-';
    if (nhanKhau.hoKhau) {
        // nhanKhau.hoKhau là ObjectId, hoặc là object đã populate
        if (typeof nhanKhau.hoKhau === 'object') {
            if(nhanKhau.hoKhau.chuHo) {
                // Đã populate, lấy chuHo rồi lấy tên
                const resChuHo = await getNhanKhau(nhanKhau.hoKhau.chuHo);
                if (resChuHo && resChuHo.type === "OK" && resChuHo.data) {
                    tenChuHo = resChuHo.data.hoTen;
                }
            }
            if(nhanKhau.hoKhau.canHo) {
                canHo = nhanKhau.hoKhau.canHo;
            }
        }
        // Nếu chưa populate thì hiển thị ID
    }

    row.onclick = (e) => {
        if (e.target.tagName === 'BUTTON') return;
        viewNhanKhau(nhanKhau.cccd);
    };

    row.innerHTML = `
        <td>${nhanKhau.cccd}</td>
        <td>${nhanKhau.hoTen}</td>
        <td>${new Date(nhanKhau.ngaySinh).toLocaleDateString('vi-VN')}</td>
        <td>${nhanKhau.gioiTinh? 'Nam' : 'Nữ'}</td>
        <td>${tenChuHo}</td>
        <td>${nhanKhau.quanHeVoiChuHo || '-'}</td>
        <td>${canHo}</td>
        <td style="text-align: center;">
            <button class="btn-action btn-action-edit" onclick="editNhanKhau('${nhanKhau.cccd}')" title="Sửa">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
                Sửa
            </button>
            <button class="btn-action btn-action-delete" onclick="removeNhanKhau('${nhanKhau.cccd}')" title="Xóa">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
                Xóa
            </button>
        </td>
    `;
    tbody.appendChild(row);
}

// 2. Lấy và hiển thị danh sách
async function loadNhanKhauList() {
    const totalNhanKhau = document.querySelector("#totalNhanKhau.stat-value")
    const totalNam = document.querySelector("#totalMale.stat-value")
    const totalNu = document.querySelector("#totalFemale.stat-value")
    const tableCount = document.querySelector("#tableCount")

    const tbody = document.getElementById('nhanKhauData');
    tbody.innerHTML = '<tr><td colspan="8">Đang tải dữ liệu...</td></tr>';

    const response = await getNhanKhauList(0, -1);

    if (response.type === "OK") {
        let nam = 0, nu = 0
        const nhanKhauList = response.data;
        console.log(nhanKhauList);
        totalNhanKhau.textContent = nhanKhauList.length
        tableCount.textContent = nhanKhauList.length + " Nhân Khẩu"
        for(const i of nhanKhauList) {
            if(i.gioiTinh) nam++;
            else nu++;
        }

        totalNam.textContent = nam
        totalNu.textContent = nu

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
    const inputs = form.querySelectorAll('input, select, textarea');
    const modalActions = form.querySelector('.modal-actions');

    modal.style.display = 'flex';
    form.reset();

    if (mode === 'edit') {
        title.innerText = "Chỉnh sửa Nhân Khẩu";
        cccdInput.disabled = true;
        inputs.forEach(input => {
            if (input !== cccdInput) input.disabled = false;
        });
        if (modalActions) modalActions.style.display = 'flex';
        fetchDetailToForm(cccd);
    } else if (mode === 'add') {
        title.innerText = "Thêm Nhân Khẩu";
        cccdInput.disabled = false;
        inputs.forEach(input => input.disabled = false);
        if (modalActions) modalActions.style.display = 'flex';
    } else {
        title.innerText = "Thông Tin Chi Tiết";
        inputs.forEach(input => input.disabled = true);
        if (modalActions) modalActions.style.display = 'none';
        fetchDetailToForm(cccd);
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
            createToast(res.message, false);
        } else {
            createToast(res.message);
        }
    }
};

// 8. Edit
window.editNhanKhau = function (cccd) {
    openModal('edit', cccd);
};

window.viewNhanKhau = function (cccd) {
    openModal('view', cccd);
};

const searchForm = document.getElementById('searchForm');
if (searchForm) {
    searchForm.addEventListener('submit', async (e) => {   
        e.preventDefault();
        const keyword = document.getElementById('keyword').value;
        const res = await searchNhanKhau(keyword);
        const tbody = document.getElementById('nhanKhauData');
        tbody.innerHTML = '';
        if (!keyword) {
            loadNhanKhauList();
            return;
        }
        if (res.type === "OK") {
            const nhanKhauList = res.data;
            for (const nhanKhau of nhanKhauList) {
                await renderRow(nhanKhau);
            }
        } else {
            createToast(res.message);
        }
    });
}

const filter = document.getElementById('filterSelect');
if (filter) {
    filter.addEventListener('change', async (e) => {   
        const gioiTinh = e.target.value;
        const res = await filterNhanKhau(gioiTinh);
        const tbody = document.getElementById('nhanKhauData');
        tbody.innerHTML = '';
        if (res.type === "OK") {
            const nhanKhauList = res.data;
            for (const nhanKhau of nhanKhauList) {
                await renderRow(nhanKhau);
            }   
        } else {
            createToast(res.message);
        }
    });
}

