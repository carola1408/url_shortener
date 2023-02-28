function copyUrl() {
  const shorterUrl = document.querySelector('#shortLinks');
  navigator.clipboard
    .writeText(shorterUrl.textContent)
    .then(() => alert('copy'))
    .catch(error => console.error(error))
}
