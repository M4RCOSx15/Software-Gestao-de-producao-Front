/**
 * materia-prima.js — lista materiais, permite cadastrar novos e ajustar estoque.
 */

let materiaisCache = [];
let selectedMaterialId = null;

function statusFor(qtd) {
  if (qtd <= 0) return { label: 'Esgotado', classes: 'bg-error-container text-on-error-container' };
  if (qtd <= 10) return { label: 'Estoque baixo', classes: 'bg-tertiary-container text-on-tertiary-container' };
  return { label: 'Normal', classes: 'bg-[#e6f4ea] text-[#137333]' };
}

function renderMateriais(list) {
  const body = document.getElementById('materiais-body');
  if (!list.length) {
    body.innerHTML = '<tr><td class="h-[48px] px-4 text-on-surface-variant" colspan="5">Nenhum material cadastrado.</td></tr>';
    return;
  }
  body.innerHTML = list
    .map((m) => {
      const status = statusFor(m.quantidadeDisponivel ?? 0);
      return `
      <tr class="border-b border-outline-variant hover:bg-surface/50 cursor-pointer transition-colors" data-row="${m.id}">
        <td class="h-[48px] px-4 font-code-sm text-code-sm text-on-surface-variant">#${m.id}</td>
        <td class="h-[48px] px-4 font-medium">${m.nome || ''}</td>
        <td class="h-[48px] px-4">${m.quantidadeDisponivel ?? 0} ${m.unidadeMedida || ''}</td>
        <td class="h-[48px] px-4"><span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${status.classes}">${status.label}</span></td>
        <td class="h-[48px] px-4 text-right">
          <button class="p-1 text-on-surface-variant hover:text-primary transition-colors" data-select="${m.id}">
            <span class="material-symbols-outlined text-[20px]">tune</span>
          </button>
        </td>
      </tr>`;
    })
    .join('');

  body.querySelectorAll('[data-select], [data-row]').forEach((el) => {
    el.addEventListener('click', () => {
      const id = Number(el.dataset.select || el.dataset.row);
      selectMaterial(id);
    });
  });
}

async function loadMateriais() {
  const body = document.getElementById('materiais-body');
  body.innerHTML = '<tr><td class="h-[48px] px-4 text-on-surface-variant" colspan="5">Carregando...</td></tr>';
  try {
    materiaisCache = await apiRequest('/api/materiaprima/listarMateriasprimas');
    renderMateriais(materiaisCache);
  } catch (err) {
    body.innerHTML = `<tr><td class="h-[48px] px-4 text-error" colspan="5">${err.message}</td></tr>`;
  }
}

function selectMaterial(id) {
  const material = materiaisCache.find((m) => m.id === id);
  if (!material) return;
  selectedMaterialId = id;

  document.getElementById('details-card').classList.remove('hidden');
  document.getElementById('detail-id').textContent = `#${material.id}`;
  document.getElementById('detail-name').textContent = material.nome;
  document.getElementById('detail-desc').textContent = material.descricao || 'Sem descrição.';
  document.getElementById('detail-unit').textContent = material.unidadeMedida || '';
  document.getElementById('quick-stock-input').value = material.quantidadeDisponivel ?? 0;
}

async function saveStock() {
  if (!selectedMaterialId) return;
  const qtd = Number(document.getElementById('quick-stock-input').value);
  if (Number.isNaN(qtd) || qtd < 0) {
    showToast('Informe uma quantidade válida.');
    return;
  }
  try {
    await apiRequest(`/api/materiaprima/${selectedMaterialId}/estoque`, {
      method: 'PATCH',
      params: { qtd },
    });
    showToast('Estoque atualizado com sucesso.', 'success');
    await loadMateriais();
    selectMaterial(selectedMaterialId);
  } catch (err) {
    showToast(err.message);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadMateriais();

  document.getElementById('detail-close').addEventListener('click', () => {
    document.getElementById('details-card').classList.add('hidden');
    selectedMaterialId = null;
  });

  document.getElementById('stock-increase').addEventListener('click', () => {
    const input = document.getElementById('quick-stock-input');
    input.value = Number(input.value || 0) + 1;
  });
  document.getElementById('stock-decrease').addEventListener('click', () => {
    const input = document.getElementById('quick-stock-input');
    input.value = Math.max(0, Number(input.value || 0) - 1);
  });
  document.getElementById('stock-save').addEventListener('click', saveStock);

  document.getElementById('search-input').addEventListener('input', (e) => {
    const term = e.target.value.trim().toLowerCase();
    renderMateriais(materiaisCache.filter((m) => (m.nome || '').toLowerCase().includes(term)));
  });

  const modal = document.getElementById('material-modal');
  document.getElementById('btn-new-material').addEventListener('click', () => {
    document.getElementById('material-form').reset();
    document.getElementById('material-form-error').classList.remove('form-error--visible');
    modal.classList.add('modal-overlay--visible');
  });
  const closeModal = () => modal.classList.remove('modal-overlay--visible');
  document.getElementById('material-modal-close').addEventListener('click', closeModal);
  document.getElementById('material-form-cancel').addEventListener('click', closeModal);

  document.getElementById('material-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const errorBox = document.getElementById('material-form-error');
    const errorText = document.getElementById('material-form-error-text');
    errorBox.classList.remove('form-error--visible');

    const payload = {
      nome: document.getElementById('material-nome').value.trim(),
      descricao: document.getElementById('material-descricao').value.trim(),
      quantidadeDisponivel: Number(document.getElementById('material-qtd').value),
      unidadeMedida: document.getElementById('material-unidade').value.trim(),
    };

    const submitBtn = document.getElementById('material-form-submit');
    submitBtn.disabled = true;
    submitBtn.classList.add('btn-disabled');
    try {
      await apiRequest('/api/materiaprima/cadastrarMateriaprima', { method: 'POST', body: payload });
      showToast('Material cadastrado com sucesso.', 'success');
      closeModal();
      loadMateriais();
    } catch (err) {
      errorText.textContent = err.message;
      errorBox.classList.add('form-error--visible');
    } finally {
      submitBtn.disabled = false;
      submitBtn.classList.remove('btn-disabled');
    }
  });
});
