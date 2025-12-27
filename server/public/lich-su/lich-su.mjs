import { getLichSuList } from "../request/lich-su.mjs";

const searchForm = document.getElementById('searchForm');
const tbody = document.getElementById('lichSuData');

// --- 1. HÀM THỰC THI CHÍNH (Tải và hiển thị) ---
async function loadAndRender(canHo = null) {
    tbody.innerHTML = '<tr><td colspan="5" class="text-center py-4">Đang tải dữ liệu...</td></tr>';
    const res = await getLichSuList(canHo);
    tbody.innerHTML = '';
    if (res.type === "SUCCESS") {
        if (res.data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="text-center py-4">Không tìm thấy lịch sử nào.</td></tr>';
            return;
        }
        for (const item of res.data) {
            renderRow(item);
        }
    } else {
        if (typeof createToast === "function") {
            createToast(res.message);
        } else {
            alert(res.message);
        }
    }
}

if (searchForm) {
    searchForm.addEventListener('submit', async (e) => {   
        e.preventDefault();
        const keyword = document.getElementById('keyword').value;
        const canHo = keyword.trim() !== "" ? parseInt(keyword, 10) : null;
        
        console.log("Tìm kiếm căn hộ:", canHo);
        await loadAndRender(canHo);
    });
}

function renderRow(item) {
    const rowsCount = item.lichSuNguoiO.length;
    
    item.lichSuNguoiO.forEach((person, index) => {
        const tr = document.createElement('tr');
        if (!person.ngayRa) tr.style.backgroundColor = "#f0f9ff";

        let roomCell = '';
        if (index === 0) {
            roomCell = `<td rowspan="${rowsCount}" class="cell-room" style="vertical-align: middle; font-weight: bold; text-align: center; background-color: #f8f9fa;">
                            ${item.soPhong}
                        </td>`;
        }
        const ngayVao = person.ngayVao ? new Date(person.ngayVao).toLocaleDateString('vi-VN') : '---';
        const ngayRa = person.ngayRa ? new Date(person.ngayRa).toLocaleDateString('vi-VN') : '<span class="text-success fw-bold">Đang ở</span>';

        tr.innerHTML = `
            ${roomCell}
            <td>${person.hoTen}</td>
            <td>${ngayVao}</td>
            <td>${ngayRa}</td>
            <td class="text-center"><span class="badge ${person.ngayRa ? 'bg-secondary' : 'bg-primary'}">${person.trangThai}</span></td>
        `;
        tbody.appendChild(tr);
    });
}
loadAndRender();