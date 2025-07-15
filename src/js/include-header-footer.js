// Inclui header.html e footer.html automaticamente
function includeHTML(selector, url) {
  fetch(url)
    .then((resp) => resp.text())
    .then((html) => {
      const el = document.querySelector(selector);
      if (el) el.outerHTML = html;
    });
}

document.addEventListener("DOMContentLoaded", function () {
  includeHTML("header", "/header.html");
  includeHTML(".reserved", "/footer.html");
});
