function handleLogin() {
  const email = document.getElementById('login-email')?.value?.trim();
  const pass  = document.getElementById('login-pass')?.value;

  if (!email || !pass)          { showToast('Please fill in all fields'); return; }
  if (!isValidEmail(email))     { showToast('Enter a valid email address'); return; }
  if (pass.length < 6)          { showToast('Password too short'); return; }

  const btn = document.querySelector('#form-login .btn-submit');
  if (btn) { btn.textContent = 'Signing In…'; btn.disabled = true; }

  setTimeout(() => {
    localStorage.setItem('nishuze_user', JSON.stringify({ email }));
    showToast('Welcome back! ✦');
    setTimeout(() => window.location.href = 'index.html', 1200);
  }, 1000);
}

function handleSignup() {
  const first = document.getElementById('first')?.value?.trim();
  const last  = document.getElementById('last')?.value?.trim();
  const email = document.getElementById('signup-email')?.value?.trim();
  const pass  = document.getElementById('signup-pass')?.value;
  const agree = document.getElementById('agree')?.checked;

  if (!first || !last || !email || !pass) { showToast('Please fill in all fields'); return; }
  if (!isValidEmail(email))               { showToast('Enter a valid email address'); return; }
  if (pass.length < 8)                    { showToast('Password must be at least 8 characters'); return; }
  if (!agree)                             { showToast('Please accept the Terms & Privacy Policy'); return; }

  const btn = document.querySelector('#form-signup .btn-submit');
  if (btn) { btn.textContent = 'Creating Account…'; btn.disabled = true; }

  setTimeout(() => {
    localStorage.setItem('nishuze_user', JSON.stringify({ email, name: first }));
    showToast(`Welcome to Nishuze, ${first}! ✦`);
    setTimeout(() => window.location.href = 'index.html', 1200);
  }, 1000);
}

function initLogin() {
  if (!document.querySelector('.right-panel')) return;

  const loginBtn  = document.querySelector('#form-login .btn-submit');
  const signupBtn = document.querySelector('#form-signup .btn-submit');
  if (loginBtn)  loginBtn.onclick  = handleLogin;
  if (signupBtn) signupBtn.onclick = handleSignup;

  const forgotLink = document.querySelector('.forgot-link');
  if (forgotLink) {
    forgotLink.addEventListener('click', e => {
      e.preventDefault();
      const email = document.getElementById('login-email')?.value?.trim();
      showToast(email ? `Reset link sent to ${email} ✦` : 'Enter your email first');
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  updateBadges();
  initNav();
  initLogin();
});
