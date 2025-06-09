document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const username = form.querySelector("input[name='username']").value;
    const password = form.querySelector("input[name='password']").value;

    
    if (username === "admin" && password === "1234") {
      window.location.href = "/pages/contact.html";
    } else {
      alert("Usuário ou senha incorretos!");
    }
  });
});