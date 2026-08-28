/**
 * novo-pedido.js — carrega clientes reais, calcula totais e cria o(s)
 * pedido(s) no back-end (um POST /api/pedidos/criarPedido por tamanho
 * com quantidade > 0, já que o back-end modela "tamanho" como campo
 * único por pedido).
 */

function showFormError(message) {
  const box = document.getElementById('form-error');
  document.getElementById('form-error-text').textContent = message;
  box.classList.add('form-error--visible');
}

function clearFormError() {
  document.getElementById('form-error').classList.remove('form-error--visible');
}

async function loadClientesOptions() {
  const select = document.getElementById('cliente-select');
  try {
    const clientes = await apiRequest('/api/clientes/listarClientes');
    if (!clientes.length) {
      select.innerHTML = '<option value="">Nenhum cliente cadastrado</option>';
      return;
    }
    select.innerHTML =
      '<option value="">Selecione um cliente</option>' +
      clientes.map((c) => `<option value="${c.id}">${c.nomeCliente} — ${c.cpfCliente}</option>`).join('');
  } catch (err) {
    select.innerHTML = '<option value="">Erro ao carregar clientes</option>';
    showFormError(err.message);
  }
}

function calculateTotals() {
  const sizeInputs = document.querySelectorAll('#size-grid input[data-size]');
  const unitPrice = parseFloat(document.getElementById('unit-price').value) || 0;
  let totalQty = 0;
  sizeInputs.forEach((input) => {
    totalQty += parseInt(input.value, 10) || 0;
  });
  const totalValue = totalQty * unitPrice;
  document.getElementById('total-qty').textContent = totalQty;
  document.getElementById('summary-qty').textContent = `${totalQty} un`;
  document.getElementById('summary-total').textContent = totalValue.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

function setSubmitting(isSubmitting) {
  const btn = document.getElementById('submit-btn');
  const label = btn.querySelector('.js-btn-label');
  btn.disabled = isSubmitting;
  btn.classList.toggle('btn-disabled', isSubmitting);
  label.textContent = isSubmitting ? 'Enviando...' : 'Criar Pedido';
}

document.addEventListener('DOMContentLoaded', () => {
  loadClientesOptions();

  document.querySelectorAll('#size-grid input[data-size]').forEach((input) => {
    input.addEventListener('input', calculateTotals);
  });
  document.getElementById('unit-price').addEventListener('input', calculateTotals);

  document.getElementById('pedido-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    clearFormError();

    const clienteId = document.getElementById('cliente-select').value;
    const modeloCamiseta = document.getElementById('model').value.trim();
    const tecido = document.getElementById('fabric').value.trim();
    const prazoEntrega = document.getElementById('deadline').value;
    const valorUnitario = parseFloat(document.getElementById('unit-price').value) || 0;
    const formaPagamento = document.getElementById('payment-method').value;

    const sizesToCreate = Array.from(document.querySelectorAll('#size-grid input[data-size]'))
      .map((input) => ({ tamanho: input.dataset.size, quantidade: parseInt(input.value, 10) || 0 }))
      .filter((s) => s.quantidade > 0);

    if (!clienteId) {
      showFormError('Selecione um cliente.');
      return;
    }
    if (!modeloCamiseta || !tecido || !prazoEntrega) {
      showFormError('Preencha modelo, tecido e prazo de entrega.');
      return;
    }
    if (!sizesToCreate.length) {
      showFormError('Informe a quantidade de ao menos um tamanho.');
      return;
    }

    setSubmitting(true);
    try {
      for (const size of sizesToCreate) {
        await apiRequest('/api/pedidos/criarPedido', {
          method: 'POST',
          body: {
            clienteId: Number(clienteId),
            modeloCamiseta,
            tecido,
            tamanho: size.tamanho,
            valorUnitario,
            quantidade: size.quantidade,
            prazoEntrega,
            formaPagamento,
          },
        });
      }
      showToast('Pedido(s) criado(s) com sucesso!', 'success');
      window.location.href = 'pedidos.html';
    } catch (err) {
      showFormError(err.message || 'Não foi possível criar o pedido.');
    } finally {
      setSubmitting(false);
    }
  });
});
