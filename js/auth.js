/**
 * auth.js — lógica das páginas login.html e registro.html.
 *
 * O bug relatado (405 + tela branca ao registrar) acontecia porque o
 * formulário original era um <form action="/auth/register" method="POST">
 * puro, sem nenhum JavaScript: o navegador fazia a submissão nativa para
 * a própria origem do arquivo HTML (ex.: http://127.0.0.1:5500/auth/register),
 * que não existe nesse servidor estático → 405 Method Not Allowed → o
 * navegador navega para essa resposta em branco.
 *
 * Além disso os campos enviados (name/password) não batiam com o DTO do
 * back-end (RegisterRequest espera nome/email/senha/role), então mesmo
 * corrigindo a URL o cadastro continuaria falhando.
 *
 * Aqui a submissão é interceptada, os dados são enviados via fetch() (com
 * JSON e nomes de campo corretos) direto para API_BASE_URL, e qualquer erro
 * é exibido na tela em vez de resultar em navegação/tela branca.
 */

function togglePasswordVisibility() {
  document.querySelectorAll('.js-toggle-password').forEach((btn) => {
    btn.addEventListener('click', () => {
      const input = document.getElementById(btn.dataset.target);
      const icon = btn.querySelector('.material-symbols-outlined');
      const isHidden = input.type === 'password';
      input.type = isHidden ? 'text' : 'password';
      icon.textContent = isHidden ? 'visibility' : 'visibility_off';
    });
  });
}

function showFormError(message) {
  const box = document.getElementById('form-error');
  const text = document.getElementById('form-error-text');
  text.textContent = message;
  box.classList.add('form-error--visible');
}

function clearFormError() {
  const box = document.getElementById('form-error');
  box.classList.remove('form-error--visible');
}

function setSubmitting(isSubmitting, idleLabel) {
  const btn = document.getElementById('submit-btn');
  const label = btn.querySelector('.js-btn-label');
  btn.disabled = isSubmitting;
  btn.classList.toggle('btn-disabled', isSubmitting);
  label.textContent = isSubmitting ? 'Enviando...' : idleLabel;
}

document.addEventListener('DOMContentLoaded', () => {
  togglePasswordVisibility();

  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      clearFormError();

      const email = document.getElementById('email').value.trim();
      const senha = document.getElementById('password').value;

      if (!email || !senha) {
        showFormError('Informe email e senha.');
        return;
      }

      setSubmitting(true, 'Entrar');
      try {
        const response = await apiRequest('/auth/login', {
          method: 'POST',
          auth: false,
          body: { email, senha },
        });
        setSession(response.token, { nome: response.nome, email: response.email });
        window.location.href = 'dashboard.html';
      } catch (err) {
        showFormError(err.message || 'Não foi possível entrar. Verifique suas credenciais.');
      } finally {
        setSubmitting(false, 'Entrar');
      }
    });
  }

  const registerForm = document.getElementById('register-form');
  if (registerForm) {
    registerForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      clearFormError();

      const nome = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const senha = document.getElementById('password').value;
      const role = document.getElementById('role').value;

      if (!nome || !email || !senha) {
        showFormError('Preencha nome, email e senha.');
        return;
      }
      if (senha.length < 8) {
        showFormError('A senha deve ter no mínimo 8 caracteres.');
        return;
      }

      setSubmitting(true, 'Registrar');
      try {
        await apiRequest('/auth/register', {
          method: 'POST',
          auth: false,
          body: { nome, email, senha, role },
        });
        showToast('Conta criada com sucesso! Faça login para continuar.', 'success');
        window.location.href = 'login.html';
      } catch (err) {
        showFormError(err.message || 'Não foi possível concluir o registro.');
      } finally {
        setSubmitting(false, 'Registrar');
      }
    });
  }
});
