// // 載入 express 並建構應用程式伺服器
// const express = require('express')
// const mongoose = require('mongoose') // 載入 mongoose
// const exphbs = require('express-handlebars') // 載入 handlebars
// const Url = require('./models/url') // 載入 url model
// const bodyParser = require('body-parser') // 引用 body-parser
// const urlShortener = require('./urlShortener')
// const vaildUrl = require('valid-url')

// // 加入這段 code, 僅在非正式環境時, 使用 dotenv
// if (process.env.NODE_ENV !== 'production') {
//   require('dotenv').config()
// }

// const app = express()

// mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true }) // 設定連線到 mongoDB

// // 取得資料庫連線狀態
// const db = mongoose.connection
// // 連線異常
// db.on('error', () => {
//   console.log('mongodb error!')
// })
// // 連線成功
// db.once('open', () => {
//   console.log('mongodb connected!')
// })

// //樣板引擎指定為 Handlebars
// app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
// app.set('view engine', 'hbs')

// // setting static files設定靜態檔案路由
// app.use(express.static('public'))

// // 用 app.use 規定每一筆請求都需要透過 body-parser 進行前置處理
// app.use(bodyParser.urlencoded({ extended: true }))

// // 設定首頁路由
// app.get('/', (req, res) => {
//   Url.find() // 取出 Url model 裡的所有資料
//     .lean() // 把 Mongoose 的 Model 物件轉換成乾淨的 JavaScript 資料陣列
//     .then(url => res.render('index', { url })) // 將資料傳給 index 樣板
//     .catch(error => console.error(error)) // 錯誤處理
// })

// //提醒防止沒有輸入內容就送出表單
// app.get('/show-alarm', (req, res) => {
//   res.send(`<script>
//     alarm("Please enter the correct URL.");
//     history.back();
//   </script>`)
// })

// //產生短網址
// app.post('/shorten', (req, res) => {
//   const originalLinks = req.body.name
//   if (!originalLinks || !vaildUrl.isWebUri(originalLinks)) {
//     return res.redirect('/show-alarm')
//   }
//   Url.findOne({ url: originalLinks })
//     .lean()
//     .then(urlData => {
//       if (!urlData) {
//         const randomUrl = urlShortener(5)
//         const host = req.get('origin')
//         const shortLinks = host + '/' + randomUrl
//         return Url.create({
//           url: originalLinks,
//           randomUrl: randomUrl,
//           shorterUrl: shortLinks
//         })
//           .then(() => {
//             res.render('newShorten', { shortLinks })
//           })
//       }
//       res.render('shorten', { urlData })
//     })
//     .catch(error => console.error(error))
// })

// //使用短網址連向原始網站
// app.get('/:shortLinks', (req, res) => {
//   const shortLinks = req.params
//   Url.findOne({ short_urls: shortLinks })
//     .then(urlData => {
//       if (!urlData) {
//         return res.render('error', {
//           errorMsg: '無法顯示網頁',
//           errorLink: req.headers.host + '/' + shortLinks,
//         })
//       }
//       res.redirect(urlData.url)
//     })
//     .catch(error => console.error(error))
// })

// // 設定 port 3000
// app.listen(3000, () => {
//   console.log('APP is running on http://localhost:3000')
// })

// require packages used in the project
const express = require('express')
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')

const Urls = require('./models/url')
const validUrl = require('valid-url')

const urlShortener = require('./urlShortener')

// require dotenv if NODE_ENV is not production
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const app = express()
const port = 3000

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true }) // 設定連線到 mongoDB
const db = mongoose.connection

db.on('error', () => {
  console.log('mongodb error!')
})

db.once('open', () => {
  console.log('mongodb connected!')
})

// setting template engine
app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

app.use(bodyParser.urlencoded({ extended: true }))

// setting static files
app.use(express.static('public'))

// routes setting
app.get('/', (req, res) => {
  res.render('index')
})

app.get('/show-alert', (req, res) => {
  res.send(`<script>
    alert("Please enter the correct URL.");
    history.back();
  </script>`)
})

app.post('/shorten', (req, res) => {
  const originalLinks = req.body.name

  // pop-up alert if no URL inputted
  if (!originalLinks || !validUrl.isWebUri(originalLinks)) {
    return res.redirect('/show-alert')
  }

  // check whether the original link is already in the database
  Urls.findOne({ original_links: originalLinks })
    .lean()
    .then(urlsData => {
      if (!urlsData) {
        // generate the new short links
        const randomString = urlShortener(5)
        const host = req.get('origin')
        const shortLinks = host + "/" + randomString
        return Urls.create({
          original_links: originalLinks,
          short_links_random_string: randomString,
          short_urls: shortLinks
        })
          .then(() => {
            res.render('newShorten', { shortLinks })
          })
      }
      res.render('shorten', { urlsData })
    })
    .catch(error => console.log(error))
})

app.get("/:shortLinks", (req, res) => {
  const { shortLinks } = req.params
  Urls.findOne({ short_links_random_string: shortLinks })
    .then(urlsData => {
      if (!urlsData) {
        // render error page if can't found the url
        return res.render("error", {
          errorMsg: "Oops! Page Not Found",
          errorLink: req.headers.host + "/" + shortLinks,
        })
      }
      res.redirect(urlsData.original_links)
    })
    .catch(error => console.error(error))
})

// start and listen on the Express server
app.listen(port, () => {
  console.log(`App is running on http://localhost:${port}`)
})