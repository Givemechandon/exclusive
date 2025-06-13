const calendar = document.getElementById("calendar");
const form = document.getElementById("appointment-form");
const appointmentsList = document.getElementById("appointments-list");
const monthYear = document.getElementById("month-year");
const prevMonthBtn = document.getElementById("prev-month");
const nextMonthBtn = document.getElementById("next-month");
const popup = document.getElementById("popup");
const popupText = document.getElementById("popup-text");

let appointments = JSON.parse(localStorage.getItem("appointmentsGP")) || {};

let selectedDate = null;
let currentDate = new Date();

function saveAppointments() {
  localStorage.setItem("appointmentsGP", JSON.stringify(appointments));
}

function openPopup(message) {
  popupText.textContent = message;
  popup.classList.add("active");
}

function closePopup() {
  popup.classList.remove("active");
}

function renderCalendar(date) {
  calendar.innerHTML = "";

  const year = date.getFullYear();
  const month = date.getMonth();

  monthYear.textContent = date.toLocaleString("pt-BR", { month: "long", year: "numeric" });

  // Primeiro dia do mês
  const firstDayOfMonth = new Date(year, month, 1);
  const startingDay = firstDayOfMonth.getDay(); // 0(domingo) a 6(sábado)

  // Número de dias no mês
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Dias da semana para cabeçalho
  const daysOfWeek = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];

  // Cabeçalho dias da semana
  daysOfWeek.forEach(day => {
    const dayName = document.createElement("div");
    dayName.classList.add("day", "disabled");
    dayName.textContent = day;
    calendar.appendChild(dayName);
  });

  // Criar blocos vazios para o início do mês
  // Ajustar porque getDay() domingo = 0, mas queremos que domingo fique na coluna 0
  let offset = startingDay === 0 ? 6 : startingDay - 1;

  for (let i = 0; i < offset; i++) {
    const emptyCell = document.createElement("div");
    emptyCell.classList.add("day", "disabled");
    calendar.appendChild(emptyCell);
  }

  // Criar os dias do mês
  for (let day = 1; day <= daysInMonth; day++) {
    const dayCell = document.createElement("div");
    dayCell.classList.add("day");
    dayCell.textContent = day;

    // Verificar se é dia selecionado
    if (selectedDate &&
      selectedDate.getFullYear() === year &&
      selectedDate.getMonth() === month &&
      selectedDate.getDate() === day) {
      dayCell.classList.add("selected");
    }

    // Montar string de data para chave no objeto
    const dateKey = `${year}-${String(month + 1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;

    // Mostrar quantos agendamentos tem no dia
    if (appointments[dateKey]) {
      const count = appointments[dateKey].length;
      const badge = document.createElement("span");
      badge.classList.add("appointments-inside");
      badge.textContent = count + (count === 1 ? " agendamento" : " agendamentos");
      dayCell.appendChild(badge);
    }

    dayCell.addEventListener("click", () => {
      selectedDate = new Date(year, month, day);
      renderCalendar(currentDate);
      renderAppointments();
    });

    calendar.appendChild(dayCell);
  }
}

function renderAppointments() {
  if (!selectedDate) {
    appointmentsList.innerHTML = "<p>Selecione um dia para ver os agendamentos.</p>";
    clearForm();
    return;
  }

  const dateKey = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth()+1).padStart(2,"0")}-${String(selectedDate.getDate()).padStart(2,"0")}`;
  const dailyAppointments = appointments[dateKey] || [];

  if (dailyAppointments.length === 0) {
    appointmentsList.innerHTML = "<p>Não há agendamentos para este dia.</p>";
  } else {
    appointmentsList.innerHTML = "";
    dailyAppointments.forEach((appt, index) => {
      const p = document.createElement("p");
      p.textContent = `${appt.nome} - ${appt.horario} - R$${appt.valor.toFixed(2)}`;

      const editBtn = document.createElement("button");
      editBtn.textContent = "Editar";
      editBtn.onclick = () => editAppointment(index);

      const delBtn = document.createElement("button");
      delBtn.textContent = "Excluir";
      delBtn.onclick = () => deleteAppointment(index);

      p.appendChild(editBtn);
      p.appendChild(delBtn);

      appointmentsList.appendChild(p);
    });
  }
}

function clearForm() {
  form.nome.value = "";
  form.horario.value = "";
  form.valor.value = "";
  form["editing-index"].value = "";
}

function editAppointment(index) {
  const dateKey = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth()+1).padStart(2,"0")}-${String(selectedDate.getDate()).padStart(2,"0")}`;
  const appt = appointments[dateKey][index];
  form.nome.value = appt.nome;
  form.horario.value = appt.horario;
  form.valor.value = appt.valor;
  form["editing-index"].value = index;
}

function deleteAppointment(index) {
  if (!confirm("Confirma exclusão deste agendamento?")) return;
  const dateKey = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth()+1).padStart(2,"0")}-${String(selectedDate.getDate()).padStart(2,"0")}`;
  appointments[dateKey].splice(index, 1);
  if (appointments[dateKey].length === 0) {
    delete appointments[dateKey];
  }
  saveAppointments();
  renderAppointments();
  renderCalendar(currentDate);
  clearForm();
  openPopup("Agendamento excluído com sucesso!");
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  if (!selectedDate) {
    openPopup("Por favor, selecione uma data no calendário.");
    return;
  }

  const nome = form.nome.value.trim();
  const horario = form.horario.value;
  const valor = parseFloat(form.valor.value);
  const editingIndex = form["editing-index"].value;

  if (!nome || !horario || isNaN(valor)) {
    openPopup("Preencha todos os campos corretamente.");
    return;
  }

  const dateKey = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth()+1).padStart(2,"0")}-${String(selectedDate.getDate()).padStart(2,"0")}`;
  if (!appointments[dateKey]) {
    appointments[dateKey] = [];
  }

  if (editingIndex === "") {
    // Novo agendamento
    appointments[dateKey].push({ nome, horario, valor });
    openPopup("Agendamento adicionado com sucesso!");
  } else {
    // Editando agendamento existente
    appointments[dateKey][editingIndex] = { nome, horario, valor };
    openPopup("Agendamento atualizado com sucesso!");
  }

  saveAppointments();
  renderCalendar(currentDate);
  renderAppointments();
  clearForm();
});

prevMonthBtn.addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar(currentDate);
  renderAppointments();
});

nextMonthBtn.addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar(currentDate);
  renderAppointments();
});

function init() {
  renderCalendar(currentDate);
  renderAppointments();
}

init();
