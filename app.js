// Xona TSA — interactions communes aux écrans d'authentification

function initTabs(container) {
  const tabs = container.querySelectorAll('.tab');
  const panels = container.querySelectorAll('.panel');

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.target;

      tabs.forEach((t) => t.classList.toggle('active', t === tab));
      panels.forEach((p) => p.classList.toggle('active', p.id === target));
    });
  });
}

function initPasswordToggles(container) {
  container.querySelectorAll('.field-toggle[data-toggle="password"]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const field = btn.closest('.field');
      const input = field.querySelector('input');
      const showIcon = btn.querySelector('.icon-eye');
      const hideIcon = btn.querySelector('.icon-eye-off');
      const isHidden = input.type === 'password';

      input.type = isHidden ? 'text' : 'password';
      showIcon.style.display = isHidden ? 'none' : 'block';
      hideIcon.style.display = isHidden ? 'block' : 'none';
    });
  });
}

function setFieldError(input, message) {
  const group = input.closest('.field-group');
  if (!group) return;
  const error = group.querySelector('.field-error');
  if (error) error.textContent = message || '';
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function isValidPhone(value) {
  return /^[0-9\s]{6,}$/.test(value.trim());
}

function initLoginForm() {
  const form = document.getElementById('login-form');
  if (!form) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    let valid = true;

    const activePanel = form.querySelector('.panel.active');
    const identifierInput = activePanel.querySelector('input[type="email"], input[type="tel"]');
    const passwordInput = form.querySelector('#login-password');

    if (identifierInput.type === 'email' && !isValidEmail(identifierInput.value)) {
      setFieldError(identifierInput, 'Adresse e-mail invalide.');
      valid = false;
    } else if (identifierInput.type === 'tel' && !isValidPhone(identifierInput.value)) {
      setFieldError(identifierInput, 'Numéro de téléphone invalide.');
      valid = false;
    } else {
      setFieldError(identifierInput, '');
    }

    if (passwordInput.value.length < 6) {
      setFieldError(passwordInput, 'Le mot de passe doit contenir au moins 6 caractères.');
      valid = false;
    } else {
      setFieldError(passwordInput, '');
    }

    if (!valid) return;

    // Le raccordement à un service d'authentification se fait ici.
    window.location.href = 'index.html';
  });
}

function initSignupForm() {
  const form = document.getElementById('signup-form');
  if (!form) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    let valid = true;

    const activePanel = form.querySelector('.panel.active');
    const identifierInput = activePanel.querySelector('input[type="email"], input[type="tel"]');
    const passwordInput = activePanel.querySelector('input[data-role="password"]');
    const confirmInput = activePanel.querySelector('input[data-role="confirm"]');

    if (identifierInput.type === 'email' && !isValidEmail(identifierInput.value)) {
      setFieldError(identifierInput, 'Adresse e-mail invalide.');
      valid = false;
    } else if (identifierInput.type === 'tel' && !isValidPhone(identifierInput.value)) {
      setFieldError(identifierInput, 'Numéro de téléphone invalide.');
      valid = false;
    } else {
      setFieldError(identifierInput, '');
    }

    if (passwordInput.value.length < 6) {
      setFieldError(passwordInput, 'Le mot de passe doit contenir au moins 6 caractères.');
      valid = false;
    } else {
      setFieldError(passwordInput, '');
    }

    if (confirmInput.value !== passwordInput.value || confirmInput.value === '') {
      setFieldError(confirmInput, 'Les mots de passe ne correspondent pas.');
      valid = false;
    } else {
      setFieldError(confirmInput, '');
    }

    if (!valid) return;

    // Le raccordement à un service d'authentification se fait ici.
    window.location.href = 'login.html';
  });
}

function initSplash() {
  const screen = document.querySelector('.splash');
  if (!screen) return;

  const goToLogin = () => {
    window.location.href = 'login.html';
  };

  const timer = setTimeout(goToLogin, 2200);
  screen.addEventListener('click', () => {
    clearTimeout(timer);
    goToLogin();
  });
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-tabs]').forEach(initTabs);
  initPasswordToggles(document);
  initLoginForm();
  initSignupForm();
  initSplash();
});
