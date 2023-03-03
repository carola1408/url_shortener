const mongoose = require('mongoose') // 載入 mongoose 
const Schema = mongoose.Schema
const urlSchema = new Schema({
  original_links: {
    type: String,
    required: true
  },
  short_links_random_string: {
    type: String,
    required: true
  },
  short_urls: {
    type: String,
    required: true
  }
})
module.exports = mongoose.model('Urls', urlSchema)