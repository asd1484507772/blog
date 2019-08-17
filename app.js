var express = require('express')
var path = require('path')
var bodyParser =require('body-parser')
var session = require('express-session')
var router = require('./router')

var app = express()

app.use('/public/', express.static(path.join(__dirname, './public/')))
app.use('/node_modules/', express.static(path.join(__dirname, './node_modules/')))

app.engine('html', require('express-art-template'))
app.set('views', path.join(__dirname, './views/'))


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
  }))
  
//把路由挂载到app中
app.use(router)

//配置一个404处理中间件
app.use(function(req,res){
  res.render('404.html')
})

//配置一个全局错误处理中间件
app.use(function(err,req,res,next){
  res.static(500).json({
    err_code : 500,
    message: err.message
  })
})

app.listen(3000, function () {
    console.log('running...')
})