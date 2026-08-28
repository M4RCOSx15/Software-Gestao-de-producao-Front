/**
 * clientes.js — lista, cria, edita e remove clientes usando /api/clientes.
 */

let clientesCache = [];

function renderClientes(list) {
  const body = document.getElementById('clientes-body');
  if (!list.length) {
    body.innerHTML = '<tr><td class="px-6 py-4 text-on-surface-variant" colspan="6">Nenhum cliente cadastrado.</td></tr>';
    return;
  }
  body.innerHTML = list
    .map(
      (c) => `
    <tr class="border-b border-surface-container-high hover:bg-surface-container-lowest transition-colors h-12">
      <td class="px-6 py-2 text-on-surface-variant">#${c.id}</td>
      <td class="px-6 py-2 font-medium">${c.nomeCliente || ''}</td>
      <td class="px-6 py-2">${c.cpfCliente || ''}</td>
      <td class="px-6 py-2">${c.telefone || ''}</td>
      <td class="px-6 py-2">${c.endereco || ''}</td>
      <td class="px-6 py-2 text-right whitespace-nowrap">
        <button class="text-on-surface-variant hover:text-primary transition-colors p-1" data-edit="${c.id}" aria-label="Editar">
          <span class="material-symbols-outlined text-xl">edit</span>
        </button>
        <button class="text-on-surface-variant hover:text-error transition-colors p-1" data-delete="${c.id}" aria-label="Excluir">
          <span class="material-symbols-outlined text-xl">delete</span>
        </button>
      </td>
    </tr>`
    )
    .join('');

  body.querySelectorAll('[data-edit]').forEach((btn) => {
    btn.addEventListener('click', () => openClientModal(Number(btn.dataset.edit)));
  });
  body.querySelectorAll('[data-delete]').forEach((btn) => {
    btn.addEventListener('click', () => deleteCliente(Number(btn.dataset.delete)));
  });
}

async function loadClientes() {
  const body = document.getElementById('clientes-body');
  body.innerHTML = '<tr><td class="px-6 py-4 text-on-surface-variant" colspan="6">Carregando...</td></tr>';
  try {
    clientesCache = await apiRequest('/api/clientes/listarClientes');
    renderClientes(clientesCache);
  } catch (err) {
    body.innerHTML = `<tr><td class="px-6 py-4 text-error" colspan="6">${err.message}</td></tr>`;
  }
}

function openClientModal(id) {
  const modal = document.getElementById('client-modal');
  const title = document.getElementById('client-modal-title');
  const form = document.getElementById('client-form');
  form.reset();
  document.getElementById('client-form-error').classList.remove('form-error--visible');

  if (id) {
    const cliente = clientesCache.find((c) => c.id === id);
    title.textContent = 'Editar Cliente';
    document.getElementById('client-id').value = id;
    document.getElementById('client-nome').value = cliente?.nomeCliente || '';
    document.getElementById('client-cpf').value = cliente?.cpfCliente || '';
    document.getElementById('client-telefone').value = cliente?.telefone || '';
    document.getElementById('client-endereco').value = cliente?.endereco || '';
  } else {
    title.textContent = 'Novo Cliente';
    document.getElementById('client-id').value = '';
  }
  modal.classList.add('modal-overlay--visible');
}

function closeClientModal() {
  document.getElementById('client-modal').classList.remove('modal-overlay--visible');
}

async function deleteCliente(id) {
  if (!confirm('Tem certeza que deseja excluir este cliente?')) return;
  try {
    await apiRequest(`/api/clientes/${id}`, { method: 'DELETE' });
    showToast('Cliente excluído com sucesso.', 'success');
    loadClientes();
  } catch (err) {
    showToast(err.message);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadClientes();

  document.getElementById('btn-new-client').addEventListener('click', () => openClientModal(null));
  document.getElementById('client-modal-close').addEventListener('click', closeClientModal);
  document.getElementById('client-form-cancel').addEventListener('click', closeClientModal);

  document.getElementById('search-input').addEventListener('input', (e) => {
    const term = e.target.value.trim().toLowerCase();
    const filtered = clientesCache.filter(
      (c) => (c.nomeCliente || '').toLowerCase().includes(term) || (c.cpfCliente || '').includes(term)
    );
    renderClientes(filtered);
  });

  document.getElementById('client-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const errorBox = document.getElementById('client-form-error');
    const errorText = document.getElementById('client-form-error-text');
    errorBox.classList.remove('form-error--visible');

    const id = document.getElementById('client-id').value;
    const payload = {
      nomeCliente: document.getElementById('client-nome').value.trim(),
      cpfCliente: document.getElementById('client-cpf').value.trim(),
      telefone: document.getElementById('client-telefone').value.trim(),
      endereco: document.getElementById('client-endereco').value.trim(),
    };

    const submitBtn = document.getElementById('client-form-submit');
    submitBtn.disabled = true;
    submitBtn.classList.add('btn-disabled');
    try {
      if (id) {
        await apiRequest(`/api/clientes/${id}`, { method: 'PUT', body: payload });
        showToast('Cliente atualizado com sucesso.', 'success');
      } else {
        await apiRequest('/api/clientes/cadastrarCliente', { method: 'POST', body: payload });
        showToast('Cliente cadastrado com sucesso.', 'success');
      }
      closeClientModal();
      loadClientes();
    } catch (err) {
      errorText.textContent = err.message;
      errorBox.classList.add('form-error--visible');
    } finally {
      submitBtn.disabled = false;
      submitBtn.classList.remove('btn-disabled');
    }
  });
});
