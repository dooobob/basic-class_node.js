var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
// ejs 모듈의 참조값 얻어오기
var ejs = require('ejs');
app.engine('.ejs', ejs.__express);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// get 방식 '/' root 요청 처리
app.get('/', function(req, res) {
    res.render('home', {
        image: '/resource/images/top01.jpg'
    });
});

// get 방식 '/person' 요청처리
app.get('/person', function(req, res) {

    // views 폴더안에 person.ejs 페이지를 해석한 결과를 클라이언트에게 응답하기
    res.render('person', {
        name: '원숭이'
    });
});

var members = [];
members.push({
    num: 1,
    name: "김구라",
    addr: "노량진"
});
members.push({
    num: 2,
    name: "해골",
    addr: "행신동"
});
members.push({
    num: 3,
    name: "원숭이",
    addr: "상도동"
});
members.push({
    num: 4,
    name: "주뎅이",
    addr: "봉천동"
});
members.push({
    num: 5,
    name: "덩어리",
    addr: "상도동"
});

app.get('/member/list', function(req, res) {
    res.render('member/list', {
        members: members
    });
});

app.get('/api/member/list', function(req, res) {
    // 클라이언트에게 회원 정보를 json 으로 응답하기
    res.json({
        members: members
    });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
