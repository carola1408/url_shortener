// function copyUrl() {
//   const shorterUrl = document.querySelector('#shortLinks');
//   navigator.clipboard
//     .writeText(shorterUrl.textContent)
//     .then(() => alert('copy'))
//     .catch(error => console.error(error))
// }
function copyUrl() {
  const url = document.querySelector("#copyBtn");
  navigator.clipboard
    .writeText(url.textContent)
    .then(() => alert("copy!"))
    .catch((error) => console.log(error));
}
