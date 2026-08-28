/**
 * dashboard.js — popula os KPIs e a tabela de pedidos recentes com dados
 * reais vindos do back-end (antes eram números fixos no HTML).
 */

const STATUS_BADGE = {
  PENDENTE: 'bg-surface-variant text-on-surface-variant',
  PRODUCAO: 'bg-primary-fixed text-on-primary-fixed-variant',
  EM_PRODUCAO: 'bg-primary-fixed text-on-primary-fixed-variant',
  CONCLUIDO: 'bg-secondary-fixed text-on-secondary-fixed',
  ATRASADO: 'bg-error-container text-on-error-container',
};

function badgeClasses(status) {
  return STATUS_BADGE[status] || 'bg-surface-variant text-on-surface-variant';
}

function formatDate(value) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('pt-BR');
}

async function loadDashboard() {
  try {
    const [pedidos, clientes, materiasPrimas] = await Promise.all([
      apiRequest('/api/pedidos/listarPedidos'),
      apiRequest('/api/clientes/listarClientes'),
      apiRequest('/api/materiaprima/listarMateriasprimas'),
    ]);

    const emProducao = pedidos.filter((p) => p.status === 'PRODUCAO' || p.status === 'EM_PRODUCAO').length;
    const baixoEstoque = materiasPrimas.filter((m) => (m.quantidadeDisponivel ?? 0) <= 10);

    document.getElementById('kpi-total-pedidos').textContent = pedidos.length;
    document.getElementById('kpi-em-producao').textContent = emProducao;
    document.getElementById('kpi-clientes').textContent = clientes.length;
    document.getElementById('kpi-alertas').textContent = baixoEstoque.length;

    const recentBody = document.getElementById('recent-orders-body');
    const recent = [...pedidos].sort((a, b) => (b.id || 0) - (a.id || 0)).slice(0, 5);
    recentBody.innerHTML = recent.length
      ? recent
          .map(
            (p) => `
        <tr class="hover:bg-surface-container-low transition-colors">
          <td class="p-4 font-code-sm">#${p.id}</td>
          <td class="p-4 font-medium">${(p.cliente && p.cliente.nomeCliente) || '—'}</td>
          <td class="p-4 text-on-surface-variant">${p.modeloCamiseta || '—'}</td>
          <td class="p-4">
            <span class="inline-flex items-center px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${badgeClasses(p.status)}">
              ${p.status || '—'}
            </span>
          </td>
          <td class="p-4 text-on-surface-variant">${formatDate(p.prazoEntrega)}</td>
        </tr>`
          )
          .join('')
      : '<tr><td class="p-4 text-on-surface-variant" colspan="5">Nenhum pedido cadastrado ainda.</td></tr>';

    const alertsList = document.getElementById('stock-alerts-list');
    alertsList.innerHTML = baixoEstoque.length
      ? baixoEstoque
          .slice(0, 5)
          .map(
            (m) => `
        <li class="flex gap-3 items-start">
          <span class="material-symbols-outlined text-error mt-0.5">error</span>
          <div>
            <p class="text-body-md font-body-md font-medium text-on-surface">Estoque baixo: ${m.nome}</p>
            <p class="text-label-md font-label-md text-on-surface-variant mt-1">${m.quantidadeDisponivel} ${m.unidadeMedida || ''} disponíveis</p>
          </div>
        </li>`
          )
          .join('')
      : '<li class="text-body-md text-on-surface-variant">Nenhum alerta no momento.</li>';
  } catch (err) {
    showToast(err.message || 'Não foi possível carregar o dashboard.');
    document.getElementById('recent-orders-body').innerHTML =
      '<tr><td class="p-4 text-error" colspan="5">Falha ao carregar pedidos.</td></tr>';
  }
}

document.addEventListener('DOMContentLoaded', loadDashboard);
