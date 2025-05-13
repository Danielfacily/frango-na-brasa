const produtos = {
  Carnes: [
    { nome: "Frango Assado", preco: 50 },
    { nome: "Costela Bovina Assada (por kg)", preco: 70, peso: true },
    { nome: "Costela Suína Assada (por kg)", preco: 60, peso: true },
    { nome: "Linguiça Assada (por kg)", preco: 50, peso: true }
  ],
  Acompanhamentos: [
    { nome: "Pote de Batatas em Conserva", preco: 10 },
    { nome: "Pote de Farofa Feijão Tropeiro", preco: 10 },
    { nome: "Pote de Maionese", preco: 10 }
  ],
  Sobremesas: [
    { nome: "Mousse de Maracujá", preco: 15 },
    { nome: "Pudim de Coco", preco: 15 },
    { nome: "Manjar de Coco", preco: 15 }
  ],
  Bebidas: [
    { nome: "Coca-Cola 2L", preco: 13 },
    { nome: "Guaraná 2L", preco: 10 },
    { nome: "Sukita 2L", preco: 10 },
    { nome: "Coca-Cola Lata 350ml", preco: 5 },
    { nome: "Guaraná Lata 350ml", preco: 5 },
    { nome: "Sukita Lata 350ml", preco: 5 },
    { nome: "Heineken 269ml", preco: 5 },
    { nome: "Original 269ml", preco: 5 }
  ]
};

// Função para atualizar o total
function atualizarTotal() {
  let total = 0;
  document.querySelectorAll(".menu-item input").forEach(input => {
    const preco = parseFloat(input.dataset.preco);
    const valor = input.type === "number" ? parseFloat(input.value) : input.checked ? 1 : 0;
    
    if (valor > 0) {
      total += valor * preco;
    }
  });
  document.getElementById("totalPedido").textContent = `Total: R$${total.toFixed(2)}`;
}

// Carregamento dinâmico das abas
document.querySelectorAll(".tab-button").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".tab-button").forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");

    document.querySelectorAll(".tab-panel").forEach(panel => {
      panel.classList.remove("active");
      if (panel.dataset.content === button.dataset.tab) {
        panel.classList.add("active");
      }
    });

    // Carrega os itens apenas se necessário
    const container = document.querySelector(`.tab-panel[data-content="${button.dataset.tab}"]`);
    if (container.children.length === 0) {
      produtos[button.dataset.tab].forEach(produto => {
        const inputId = produto.nome.replace(/\s/g, '_');
        const inputType = produto.peso ? "number" : "checkbox";
        const label = document.createElement("label");
        label.className = "menu-item";
        label.innerHTML = `
          <input type="${inputType}" 
                 id="${inputId}"
                 name="${produto.nome}" 
                 data-preco="${produto.preco}" 
                 ${produto.peso ? 'min="0.1" step="0.1" placeholder="kg"' : ""}/>
          <label for="${inputId}">
            ${produto.nome} - R$${produto.preco}${produto.peso ? " /kg" : ""}
          </label>
        `;
        container.appendChild(label);
        
        // Adiciona eventos aos novos inputs
        const input = label.querySelector('input');
        input.addEventListener('input', atualizarTotal);
        if (input.type === 'checkbox') {
          input.addEventListener('change', atualizarTotal);
        }
      });
    }
  });
});

// Ativa a aba inicial
document.querySelector(".tab-button[data-tab='Carnes']").click();

// Formulário
document.getElementById("orderForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const nome = document.getElementById("name").value.trim();
  const telefone = document.getElementById("phone").value.trim();
  const entrega = document.getElementById("deliveryType").value;
  const codigo = document.getElementById("pickupCode").value.trim();
  const observacoes = document.getElementById("observacoes").value.trim();

  // Validação de telefone
  const telefoneNumerico = telefone.replace(/\D/g, '');
  if (telefoneNumerico.length < 10 || telefoneNumerico.length > 11) {
    alert("Telefone inválido! Deve conter 10 ou 11 dígitos (com DDD).");
    return;
  }

  if (!confirm("Confirma o envio deste pedido?")) return;

  let mensagem = `*Pedido Frango na Brasa*%0A`;
  mensagem += `*Nome:* ${nome}%0A`;
  mensagem += `*Telefone:* ${telefone}%0A`;
  mensagem += `*Itens:*%0A`;

  let total = 0;
  document.querySelectorAll(".menu-item input").forEach(input => {
    const nomeItem = input.name;
    const preco = parseFloat(input.dataset.preco);
    if ((input.type === "checkbox" && input.checked) || 
        (input.type === "number" && parseFloat(input.value) > 0)) {
      const qtd = input.type === "number" ? parseFloat(input.value) : 1;
      const precoItem = qtd * preco;
      mensagem += `- ${nomeItem} ${input.type === "number" ? `(${qtd.toFixed(2)}kg)` : ""} - R$${precoItem.toFixed(2)}%0A`;
      total += precoItem;
    }
  });

  mensagem += `*Entrega:* ${entrega}%0A`;
  if (codigo) mensagem += `*Código de Coleta:* ${codigo}%0A`;
  if (observacoes) mensagem += `%0A*Observações:*%0A${observacoes}%0A`;
  mensagem += `%0A*Valor Estimado:* R$${total.toFixed(2)}`;

  const url = `https://wa.me/55${telefoneNumerico}?text=${mensagem}`;
  window.open(url, "_blank");
});

// Inicializa o total
atualizarTotal();