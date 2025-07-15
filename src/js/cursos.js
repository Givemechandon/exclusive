// Estrutura inicial de cursos
let cursos = JSON.parse(localStorage.getItem("cursosGP")) || [];

function salvarCursos() {
  localStorage.setItem("cursosGP", JSON.stringify(cursos));
}

function renderCursos() {
  const lista = document.getElementById("cursos-lista");
  lista.innerHTML = "";
  if (cursos.length === 0) {
    lista.innerHTML =
      '<p style="color:#fff;text-align:center;">Nenhum curso cadastrado.</p>';
    return;
  }
  cursos.forEach((curso, idx) => {
    const card = document.createElement("div");
    card.className = "curso-card";
    // Ações
    const actions = document.createElement("div");
    actions.className = "curso-actions";
    actions.innerHTML = `
      <button onclick="editarCurso(${idx})"><i class='fa fa-edit'></i></button>
      <button onclick="removerCurso(${idx})"><i class='fa fa-trash'></i></button>
    `;
    card.appendChild(actions);
    // Info
    const info = document.createElement("div");
    info.className = "curso-info";
    info.innerHTML = `
      <span><b>Valor:</b> R$${curso.valor}</span>
      <span><b>Duração:</b> ${curso.duracao}h</span>
      <span><b>Alunos:</b> ${curso.alunos.length}</span>
    `;
    card.appendChild(info);
    // Módulos
    const modulos = document.createElement("div");
    modulos.className = "curso-modulos";
    curso.modulos.forEach((m) => {
      const mod = document.createElement("span");
      mod.className = "curso-modulo";
      mod.textContent = m;
      modulos.appendChild(mod);
    });
    card.appendChild(modulos);
    // Alunos
    const alunosDiv = document.createElement("div");
    alunosDiv.className = "curso-alunos";
    alunosDiv.innerHTML = "<h4>Alunos</h4>";
    const alunosLista = document.createElement("div");
    alunosLista.className = "curso-alunos-lista";
    curso.alunos.forEach((aluno, aidx) => {
      const item = document.createElement("div");
      item.className = "aluno-item";
      item.innerHTML = `
        <label>Nome: <input type='text' value='${aluno.nome}' onchange='atualizarAluno(${idx},${aidx},"nome",this.value)' /></label>
        <label>Data: <input type='date' value='${aluno.data}' onchange='atualizarAluno(${idx},${aidx},"data",this.value)' /></label>
        <label>Valor: <input type='number' value='${aluno.valor}' min='0' step='0.01' onchange='atualizarAluno(${idx},${aidx},"valor",this.value)' /></label>
        <button onclick='removerAluno(${idx},${aidx})'><i class='fa fa-trash'></i></button>
      `;
      alunosLista.appendChild(item);
    });
    alunosDiv.appendChild(alunosLista);
    // Botão adicionar aluno
    const btnAddAluno = document.createElement("button");
    btnAddAluno.textContent = "+ Adicionar Aluno";
    btnAddAluno.style.marginTop = "0.5rem";
    btnAddAluno.onclick = () => adicionarAluno(idx);
    alunosDiv.appendChild(btnAddAluno);
    card.appendChild(alunosDiv);
    lista.appendChild(card);
  });
}

function adicionarCurso() {
  const nome = prompt("Nome do curso:");
  if (!nome) return;
  const valor = prompt("Valor do curso (apenas número):");
  const duracao = prompt("Duração do curso (horas):");
  const modulos = prompt("Módulos do curso (separados por vírgula):");
  cursos.push({
    nome,
    valor: valor || "0",
    duracao: duracao || "0",
    modulos: modulos ? modulos.split(",").map((m) => m.trim()) : [],
    alunos: [],
  });
  salvarCursos();
  renderCursos();
}

function removerCurso(idx) {
  if (!confirm("Remover este curso?")) return;
  cursos.splice(idx, 1);
  salvarCursos();
  renderCursos();
}

function editarCurso(idx) {
  const curso = cursos[idx];
  const nome = prompt("Nome do curso:", curso.nome);
  if (!nome) return;
  const valor = prompt("Valor do curso:", curso.valor);
  const duracao = prompt("Duração do curso:", curso.duracao);
  const modulos = prompt(
    "Módulos do curso (separados por vírgula):",
    curso.modulos.join(", ")
  );
  cursos[idx] = {
    ...curso,
    nome,
    valor: valor || "0",
    duracao: duracao || "0",
    modulos: modulos ? modulos.split(",").map((m) => m.trim()) : [],
  };
  salvarCursos();
  renderCursos();
}

function adicionarAluno(idx) {
  cursos[idx].alunos.push({ nome: "", data: "", valor: "" });
  salvarCursos();
  renderCursos();
}

function removerAluno(idx, aidx) {
  cursos[idx].alunos.splice(aidx, 1);
  salvarCursos();
}

function atualizarAluno(idx, aidx, campo, valor) {
  cursos[idx].alunos[aidx][campo] = valor;
  salvarCursos();
}

// Modal de curso
const modalBg = document.getElementById("modal-curso");
const formCurso = document.getElementById("form-curso");
const btnFecharModal = document.getElementById("fechar-modal-curso");
const btnAddCurso = document.getElementById("btn-add-curso");

btnAddCurso.onclick = () => {
  document.getElementById("curso-nome").value = "";
  document.getElementById("curso-valor").value = "";
  document.getElementById("curso-duracao").value = "";
  document.getElementById("curso-modulos").value = "";
  modalBg.style.display = "flex";
  document.getElementById("curso-nome").focus();
};

btnFecharModal.onclick = () => {
  modalBg.style.display = "none";
};

formCurso.onsubmit = function (e) {
  e.preventDefault();
  const nome = document.getElementById("curso-nome").value.trim();
  const valor = document.getElementById("curso-valor").value;
  const duracao = document.getElementById("curso-duracao").value;
  const modulos = document.getElementById("curso-modulos").value;
  if (!nome) return;
  cursos.push({
    nome,
    valor: valor || "0",
    duracao: duracao || "0",
    modulos: modulos ? modulos.split(",").map((m) => m.trim()) : [],
    alunos: [],
  });
  salvarCursos();
  renderCursos();
  modalBg.style.display = "none";
};

renderCursos();
