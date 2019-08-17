var express = require('express')
var md5 = require('md5')
var User = require('./models/user')

var router = express.Router()

router.get('/', function (req, res) {
    res.render('index.html', {
        user: req.session.user
    })
})

router.get('/login', function (req, res) {
    res.render('login.html')
})

router.post('/login', function (req, res,next) {
    var body = req.body
    User.findOne({
        email: body.email,
        password: md5(md5(body.password))
    }, function (err, user) {
        if (err) {
            // return res.status(500).json({
            //     err_code: 500,
            //     message: err.message
            // })
            return next(err)
        }

        if (!user) {
            return res.status(200).json({
                err_code: 1,
                message: 'Email or password is invalid.'
            })
        }

        req.session.user = user

        res.status(200).json({
            err_code: 0,
            message: 'OK'
        })
    })
})

router.get('/register', function (req, res) {
    res.render('register.html')
})

router.post('/register', function (req, res,next) {
    var body = req.body
    User.findOne({
        $or: [
            {
                email: body.email
            },
            {
                nickname: body.nickname
            }
        ]
    }, function (err, data) {
        if (err) {
            // return res.status(500).json({
            //     success: false,
            //     message: '服务端错误'
            // })
            return next(err)
        }

        if (data) {
            // 邮箱或者昵称已存在
            return res.status(200).json({
                err_code: 1,
                message: 'Email or nickname aleady exists.'
            })
        }

        //对密码进行加密
        body.password = md5(md5(body.password))

        new User(body).save(function (err, user) {
            if (err) {
                // return res.status(500).json({
                //     err_code: 500,
                //     message: 'Internal error.'
                // })
                return next(err)
            }

            // 注册成功，使用 Session 记录用户的登陆状态
            req.session.user = user

            res.status(200).json({
                err_code: 0,
                message: 'OK'
            })
        })
    })
})

router.get('/logout', function (req, res) {
    //清除登录状态 
    //req.session.user = null
    //delete更严谨
    delete req.session.user
    //重定向到登录页
    res.redirect('/login')
})

module.exports = router