/**
 * Hàm render layout chung (topbar + sidebar)
 * @param {string} activePage - Trang đang active: 'ho-khau', 'nhan-khau', 'khoan-thu'
 */
export function renderLayout(activePage) {
    const topbarHTML = `
        <nav class="topbar">
            <div class="logo">Hệ Thống Quản Lý</div>
            <ul class="nav-links">
                <button class="btn btn-danger" onclick="logout()">Đăng xuất</button>
            </ul>
        </nav>
    `;

    const sidebarHTML = `
        <nav class="sidebar">
            <a href="../ho-khau/ho-khau.html">
                <div class="sidebar-link ${activePage === 'ho-khau' ? 'chosen-link' : ''}">
                    <img src="../images/ho-khau.png">
                    <div class="sidebar-text ${activePage === 'ho-khau' ? 'chosen-link' : ''}">Quản lý</div>
                    <div class="sidebar-text ${activePage === 'ho-khau' ? 'chosen-link' : ''}">hộ khẩu</div>
                </div>
            </a>
            <a href="../nhan-khau/nhan-khau.html">
                <div class="sidebar-link ${activePage === 'nhan-khau' ? 'chosen-link' : ''}">
                    <img src="../images/nhan-khau.png">
                    <div class="sidebar-text ${activePage === 'nhan-khau' ? 'chosen-link' : ''}">Quản lý</div>
                    <div class="sidebar-text ${activePage === 'nhan-khau' ? 'chosen-link' : ''}">nhân khẩu</div>
                </div>
            </a>
            <a href="../thu-chi/thu-chi.html">
                <div class="sidebar-link ${activePage === 'khoan-thu' ? 'chosen-link' : ''}">
                    <img src="../images/khoan-thu.png">
                    <div class="sidebar-text ${activePage === 'khoan-thu' ? 'chosen-link' : ''}">Quản lý</div>
                    <div class="sidebar-text ${activePage === 'khoan-thu' ? 'chosen-link' : ''}">Khoản thu</div>
                </div>
            </a>
        </nav>
    `;

    // Insert vào đầu body
    document.body.insertAdjacentHTML('afterbegin', topbarHTML + sidebarHTML);
}

// Hàm đăng xuất
window.logout = function() {
    if (confirm('Bạn có chắc muốn đăng xuất?')) {
        localStorage.removeItem('token');
        window.location.href = '../login/login.html';
    }
}
