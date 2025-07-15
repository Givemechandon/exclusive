// Dashboard GP Sys
// Busca dados do localStorage (appointmentsGP) e exibe estatísticas

document.addEventListener("DOMContentLoaded", function () {
  // Elementos
  const totalRecebidoEl = document.querySelector("#total-recebido .valor");
  const totalClientesEl = document.querySelector("#total-clientes .valor");
  const pixCpfEl = document.querySelector("#pix-cpf .valor");
  const pixCnpjEl = document.querySelector("#pix-cnpj .valor");
  const rankingEl = document.getElementById("ranking-clientes");
  const graficoCanvas = document.getElementById("grafico-movimento");

  // Dados
  const appointments = JSON.parse(localStorage.getItem("appointmentsGP")) || {};
  let clientes = {};
  let totalRecebido = 0;
  let totalPixCpf = 0;
  let totalPixCnpj = 0;
  let diasMovimento = {};
  let clientesUnicos = new Set();

  // Processamento
  Object.entries(appointments).forEach(([data, agendamentos]) => {
    diasMovimento[data] = agendamentos.length;
    agendamentos.forEach((ag) => {
      // Ranking de clientes
      if (!clientes[ag.nome]) clientes[ag.nome] = 0;
      clientes[ag.nome] += 1;
      clientesUnicos.add(ag.nome);
      // Valores
      totalRecebido += Number(ag.valor) || 0;
      // Tipo de PIX
      if (ag.tipoPix === "cnpj") {
        totalPixCnpj += Number(ag.valor) || 0;
      } else {
        totalPixCpf += Number(ag.valor) || 0;
      }
    });
  });

  // Exibir totais
  totalRecebidoEl.textContent =
    "R$ " + totalRecebido.toLocaleString("pt-BR", { minimumFractionDigits: 2 });
  totalClientesEl.textContent = clientesUnicos.size;
  pixCpfEl.textContent =
    "R$ " + totalPixCpf.toLocaleString("pt-BR", { minimumFractionDigits: 2 });
  pixCnpjEl.textContent =
    "R$ " + totalPixCnpj.toLocaleString("pt-BR", { minimumFractionDigits: 2 });

  // Ranking de clientes (top 5)
  const ranking = Object.entries(clientes)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  rankingEl.innerHTML = "";
  ranking.forEach(([nome, qtd]) => {
    const li = document.createElement("li");
    li.textContent = `${nome} (${qtd} atendimento${qtd > 1 ? "s" : ""})`;
    rankingEl.appendChild(li);
  });

  // Movimento por dia (top 3 mais e 3 menos)
  const listaMovimento = document.getElementById("lista-movimento");
  if (listaMovimento) {
    const dias = Object.entries(diasMovimento);
    if (dias.length > 0) {
      // Ordena por quantidade de atendimentos
      const ordenado = dias.sort((a, b) => b[1] - a[1]);
      const topMais = ordenado.slice(0, 3);
      const topMenos = ordenado.slice(-3).reverse();
      listaMovimento.innerHTML = "";
      topMais.forEach(([dia, qtd]) => {
        const li = document.createElement("li");
        li.className = "mais";
        li.innerHTML = `<i class='fa-solid fa-arrow-up'></i> ${dia} — <b>${qtd}</b> atendimento${
          qtd > 1 ? "s" : ""
        }`;
        listaMovimento.appendChild(li);
      });
      topMenos.forEach(([dia, qtd]) => {
        if (!topMais.some(([d]) => d === dia)) {
          // Evita duplicar se houver poucos dias
          const li = document.createElement("li");
          li.className = "menos";
          li.innerHTML = `<i class='fa-solid fa-arrow-down'></i> ${dia} — <b>${qtd}</b> atendimento${
            qtd > 1 ? "s" : ""
          }`;
          listaMovimento.appendChild(li);
        }
      });
    } else {
      listaMovimento.innerHTML =
        "<li>Nenhum dado de movimento disponível.</li>";
    }
  }
});
