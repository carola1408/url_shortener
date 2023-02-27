const mongoose = require('mongoose') // 載入 mongoose
const url = require('../url')  // 載入 url model
// 加入這段 code, 僅在非正式環境時, 使用 dotenv
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const urlShortener = require('../../urlShortener')

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true }) // 設定連線到 mongoDB

// 取得資料庫連線狀態
const db = mongoose.connection
// 連線異常
db.on('error', () => {
  console.log('mongodb error!')
})
// 連線成功
db.once('open', () => {
  console.log('mongodb connected!')
})

//新增資料
db.once('open', () => {
  console.log('mongodb connected')
  const originalLinks = "http://www.goole.com"
  const randomUrl = urlShortener(5)
  const host = "http://localhost:3000"
  const shortLinks = host + "/" + randomUrl
  url.create({
    url: originalLinks,
    shorterUrl: randomUrl,
    short_urls: shortLinks
  })
  console.log('done')
})

