// 載入 express 並建構應用程式伺服器
const express = require('express')
const mongoose = require('mongoose') // 載入 mongoose
const exphbs = require('express-handlebars') // 載入 handlebars
const Url = require('./models/url') // 載入 url model
const bodyParser = require('body-parser') // 引用 body-parser
const urlShortener = require('./urlShortener')

// 加入這段 code, 僅在非正式環境時, 使用 dotenv
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const app = express()

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

//樣板引擎指定為 Handlebars
app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

// setting static files設定靜態檔案路由
app.use(express.static('public'))


// 用 app.use 規定每一筆請求都需要透過 body-parser 進行前置處理
app.use(bodyParser.urlencoded({ extended: true }))



// 設定首頁路由
app.get('/', (req, res) => {
  Url.find() // 取出 Url model 裡的所有資料
    .lean() // 把 Mongoose 的 Model 物件轉換成乾淨的 JavaScript 資料陣列
    .then(url => res.render('index', { url })) // 將資料傳給 index 樣板
    .catch(error => console.error(error)) // 錯誤處理
})

app.post('/shorten', (req, res) => {
  const originalLinks = req.body.name
  Url.findOne({ url: originalLinks })
    .lean()
    .then(urlData => {
      if (!urlData) {
        const randomUrl = urlShortener(5)
        const host = req.get('origin')
        const shortLinks = host + "/" + randomUrl
        return Url.create({
          url: originalLinks,
          shorterUrl: randomUrl,
          short_urls: shortLinks
        })
          .then(() => {
            res.render('newShorten', { shortLinks })
          })
      }
      res.render('shorten', { urlData })
    })
    .catch(error => console.error(error))
})

app.get('/:shortLinks', (req, res) => {
  const shortLinks = req.params
  Url.findOne({ short_urls: shortLinks })
    .then(urlData => {
      if (!urlData) {
        return res.render('error', {
          errorMsg: '無法顯示網頁',
          errorLink: req.headers.host + '/' + shortLinks,

        })
      }
      res.redirect(urlData.url)
    })
    .catch(error => console.error(error))
})

// 設定 port 3000
app.listen(3000, () => {
  console.log('APP is running on http://localhost:3000')
})
