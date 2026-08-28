/**
 * pedidos.js — lista pedidos reais e permite atualizar o status inline.
 */

let pedidosCache = [];

const STATUS_OPTIONS = ['PENDENTE', 'PRODUCAO', 'CONCLUIDO', 'ATRASADO'];
const STATUS_BADGE = {
  PENDENTE: 'bg-surface-variant text-on-surface-variant',
  PRODUCAO: 'bg-primary-fixed text-on-primary-fixed-variant',
  CONCLUIDO: 'bg-secondary-fixed text-on-secondary-fixed',
  ATRASADO: 'bg-error-container text-on-error-container',
};

function formatCurrency(value) {
  return (value ?? 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function formatDate(value) {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString('pt-BR');
}

function renderPedidos(list) {
  const body = document.getElementById('pedidos-body');
  if (!list.length) {
    body.innerHTML = '<tr><td class="p-4 text-on-surface-variant" colspan="7">Nenhum pedido encontrado.</td></tr>';
    return;
  }
  body.innerHTML = list
    .map(
      (p) => `
    <tr class="border-b border-outline-variant hover:bg-surface-container-low transition-colors">
      <td class="p-4 font-code-sm">#${p.id}</td>
      <td class="p-4">${(p.cliente && p.cliente.nomeCliente) || '—'}</td>
      <td class="p-4">${p.modeloCamiseta || '—'} <span class="text-on-surface-variant text-xs">(${p.tamanho || '-'})</span></td>
      <td class="p-4 text-right">${p.quantidade ?? 0}</td>
      <td class="p-4 text-right">${formatCurrency(p.valorTotal)}</td>
      <td class="p-4">${formatDate(p.prazoEntrega)}</td>
      <td class="p-4">
        <select class="h-8 px-2 rounded border border-outline-variant text-label-md font-label-md ${STATUS_BADGE[p.status] || ''}" data-status-select="${p.id}">
          ${STATUS_OPTIONS.map((s) => `<option value="${s}" ${s === p.status ? 'selected' : ''}>${s}</option>`).join('')}
        </select>
      </td>
    </tr>`
    )
    .join('');

  body.querySelectorAll('[data-status-select]').forEach((select) => {
    select.addEventListener('change', () => updateStatus(Number(select.dataset.statusSelect), select.value));
  });
}

async function loadPedidos() {
  const body = document.getElementById('pedidos-body');
  body.innerHTML = '<tr><td class="p-4 text-on-surface-variant" colspan="7">Carregando...</td></tr>';
  try {
    pedidosCache = await apiRequest('/api/pedidos/listarPedidos');
    applyFilter();
  } catch (err) {
    body.innerHTML = `<tr><td class="p-4 text-error" colspan="7">${err.message}</td></tr>`;
  }
}

function applyFilter() {
  const status = document.getElementById('status-filter').value;
  const filtered = status ? pedidosCache.filter((p) => p.status === status) : pedidosCache;
  renderPedidos(filtered);
}

async function updateStatus(id, novoStatus) {
  try {
    await apiRequest(`/api/pedidos/${id}/status`, { method: 'PATCH', params: { status: novoStatus } });
    showToast('Status atualizado com sucesso.', 'success');
    const pedido = pedidosCache.find((p) => p.id === id);
    if (pedido) pedido.status = novoStatus;
  } catch (err) {
    showToast(err.message);
    loadPedidos();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadPedidos();
  document.getElementById('status-filter').addEventListener('change', applyFilter);
});
