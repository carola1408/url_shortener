function copyUrl() {
  const url = document.querySelector("#urlShortener");
  navigator.clipboard
    .writeText(url.textContent)
    .then(() => alert("copy"))
    .catch(error => console.error(error))
}