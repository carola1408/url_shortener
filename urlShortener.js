module.exports = (num) => {
  const garbled = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  const garbledLength = garbled.length
  for (let i = 0; i < num; i++) {
    result += garbled.charAt(Math.floor(Math.random() * garbledLength))
  }
  return result
}
module.exports = 