function copyUrl() {
  const url = document.querySelector('#shorturl');
  navigator.clipboard
    .writeText(url.textContent)
    .then(() => alert('copy'))
    .catch(error => console.error(error))
}