/**
 * auth-guard.js — protege páginas internas (tudo exceto login/registro).
 * Deve ser incluído depois de api.js.
 */
(function () {
  if (!isAuthenticated()) {
    window.location.href = 'login.html';
    return;
  }

  document.addEventListener('DOMContentLoaded', () => {
    const user = getUser();

    document.querySelectorAll('[data-user-name]').forEach((el) => {
      el.textContent = (user && user.nome) || 'Usuário';
    });
    document.querySelectorAll('[data-user-initial]').forEach((el) => {
      el.textContent = ((user && user.nome) || 'U').trim().charAt(0).toUpperCase();
    });

    document.querySelectorAll('[data-logout]').forEach((el) => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        clearSession();
        window.location.href = 'login.html';
      });
    });
  });
})();
