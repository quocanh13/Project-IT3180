// Gán vào window để HTML onclick có thể gọi được
window.openModal = function(mode, cccd = null) {
    const modal = document.getElementById('nhanKhauModal');
    const title = document.getElementById('modalTitle');
    const cccdInput = document.getElementById('cccd');
    const form = document.getElementById('nhanKhauForm');

    if (!modal || !title) {
        console.error("Không tìm thấy các phần tử Modal trong DOM");
        return;
    }

    // Hiển thị modal trước để các thay đổi bên dưới có thể nhìn thấy
    modal.style.display = 'flex'; 
    form.reset();

    if (mode === 'edit') {
        title.innerText = "Chỉnh sửa Nhân Khẩu"; // Sửa nội dung thẻ h2
        cccdInput.disabled = true; 
        if (typeof fetchDetailToForm === "function") {
            fetchDetailToForm(cccd);
        }
    } else {
        title.innerText = "Thêm Nhân Khẩu"; // Sửa nội dung thẻ h2
        cccdInput.disabled = false;
    }
};

// Hàm đóng modal
window.closeModal = function() {
    const modal = document.getElementById('nhanKhauModal');
    modal.style.display = 'none';
};