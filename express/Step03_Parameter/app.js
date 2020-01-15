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

// multipart 파일 업로드 요청 처리를 하기 위한 설정
var multer = require('multer');
// 파일 업로드 할때 설정 정보를 전달한다.
var upload = multer({
    dest: "./upload/"
});


// get 방식 '/' root 요청 처리
app.get('/', function(req, res) {
    res.render('home', {
        name: 'Express'
    });
});


// 가상의 DB라고 하자
var members = [];

app.post('/member/insert', function(req, res) {
    var num = req.body.num;
    var name = req.body.name;
    var addr = req.body.addr;

    var obj = {};
    obj.num = num;
    obj.name = name;
    obj.addr = addr;

    members.push(obj);

    console.log(num + '|' + name + '|' + addr);
    res.end('post ok!');
});

app.get('/member/insert2', function(req, res) {
    var num = req.query.num;
    var name = req.query.name;
    var addr = req.query.addr;

    var obj = {};
    obj.num = num;
    obj.name = name;
    obj.addr = addr;

    members.push(obj);

    console.log(num + '|' + name + '|' + addr);
    res.end('get ok!');
});

app.get('/picture/detail', function(req, res) {
    // get 방식으로 전달된 파라미터 추출
    var value = req.query.index;
    // view/picture 폴더 안에 detail.ejs 페이지를 해석한 결과를 응답!
    res.render('picture/detail', {
        index: value
    });
});

app.get('/member/list', function(req, res) {
    res.render('member/list', {
        members: members
    });
});

// 파일 업로드 요청 처리
app.post('/board/fileup', upload.single('myFile'), function(req, res) {
    // 업로드된 파일의 정보를 가지고 있는 object 구조 확인
    console.log(req.file);
    console.log('================================');
    console.log(req.body);
    res.end('ok!');
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
