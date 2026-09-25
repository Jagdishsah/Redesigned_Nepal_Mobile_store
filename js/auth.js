/* ==========================================================================
   Nepal Mobile Store — Auth & Toast Notification Utilities (js/auth.js)
   ========================================================================== */

export function showToast(message, type = 'info') {
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let icon = 'fa-info-circle';
    if (type === 'success') icon = 'fa-check-circle';
    if (type === 'warning') icon = 'fa-exclamation-triangle';
    if (type === 'danger') icon = 'fa-exclamation-circle';

    toast.innerHTML = `<i class="fas ${icon}"></i> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(100%)';
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}

export function initAuthForms() {
    const passwordInput = document.getElementById('password');
    const toggleEye = document.getElementById('togglePassword');

    if (passwordInput && toggleEye) {
        toggleEye.addEventListener('click', () => {
            const isPassword = passwordInput.type === 'password';
            passwordInput.type = isPassword ? 'text' : 'password';
            toggleEye.classList.toggle('fa-eye');
            toggleEye.classList.toggle('fa-eye-slash');
        });
    }

    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            const pwd = document.getElementById('password')?.value;
            const confirmPwd = document.getElementById('confirm_password')?.value;

            if (pwd !== confirmPwd) {
                e.preventDefault();
                showToast('Passwords do not match!', 'danger');
            }
        });
    }
}
