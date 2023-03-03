const mongoose = require('mongoose') // 載入 mongoose
const Schema = mongoose.Schema  //定義資料結構
const urlSchema = new Schema({
  originalUrl: {
    type: String, // 資料型別是字串
    required: true  // 這是個必填欄位
  },
  randomUrl: {
    type: String, // 資料型別是字串
    required: true  // 這是個必填欄位
  },
  shorterUrl: {
    type: String,
    required: true
  }
})
module.exports = mongoose.model('Urls', urlSchema)
// const mongoose = require('mongoose')
// const Schema = mongoose.Schema
// const urlSchema = new Schema({
//   original_links: {
//     type: String,
//     required: true
//   },
//   short_links_random_string: {
//     type: String,
//     required: true
//   },
//   short_urls: {
//     type: String,
//     required: true
//   }
// })
// module.exports = mongoose.model('Urls', urlSchema)