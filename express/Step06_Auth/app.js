var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require("express-session");
// "/" 요청 라우팅
var routes = require('./routes/index');
// 파일 업로드 처리하기 위한 모듈
var multer = require("multer");
// mongodb 접속 설정 모듈
var configDB = require("./config/database.js");
// node.js server 에서 mongodb 사용 하기 위한 모듈
var mongoose = require("mongoose");
// express app 객체 얻어오기
var app = express();

//mongodb 연결 요청하기
mongoose.connect(configDB.url);
//db 객체 얻어오기
var db = mongoose.connection;
//mongodb 연결 성공했을때 실행할 함수 등록
db.once("open", function(err) {
    if (err) {
        console.log(err);
    } else {
        console.log("mongoDB 접속 성공!");
    }
});


// ejs 모듈을 사용하기 위한 설정
var ejs = require("ejs");
//해석을 할때 여는 기호와 닫는 기호를 [%  와  %] 로 설정하기
//ejs.open="[%";
//ejs.close="%]";
app.engine(".ejs", ejs.__express);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon());
//개발이 끝난후 주석처리 한다.
app.use(logger('dev'));
// body 에 전달되는 파라미터를 추출하기 위한 미들웨어
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
// 쿠키와 세션을 사용하기 위한 미들웨어
app.use(cookieParser("kimgura"));
app.use(session({
    secret: "express-template",
    saveUninitialized: true,
    resave: true
}));
// 외부 공개 폴더의 경로를 설정하기 위한 미들 웨어
app.use(express.static(path.join(__dirname, 'public')));

//파일 업로드 폴더 경로 설정하기 위한 미들 웨어
app.use(multer({
    dest: "./upload/"
}));
/* //업로드 사이즈 제한
app.use(multer({
    dest:"./upload/",
    limits:{
        fileSize:1024*1000*16  //Max : 16 Mbyte
    }
}));
*/

//passport 객체를 사용하기 위한 설정
var passport = require("passport");
var flash = require("connect-flash");
app.use(passport.initialize());
app.use(passport.session());
app.use(flash()); //플레시 메세지를 사용할수 있도록
require("./config/initPassport")(passport);

// "/users/" 하위 요청을 처리할 모듈
var usersRouter = require("./routes/users");

// "/" 하위 요청 라우팅
app.use('/', routes);
app.use("/users/", usersRouter);


/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error 다루기

// dev 모드에서 에러처리
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
