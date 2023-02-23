const mongoose = require('mongoose') // 載入 mongoose
const Schema = mongoose.Schema  //定義資料結構
const urlSchema = new Schema({
  original_links: {
    type: String, // 資料型別是字串
    required: true  // 這是個必填欄位
  },
  short_links_random_string: {
    type: String,
    require: true
  }
})
module.exports = mongoose.model('Urls', urlSchema)