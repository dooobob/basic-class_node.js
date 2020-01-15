// express 모듈의 참조값 얻어오기
var express = require('express');
// express 에서 제공하는 router 객체의 참조값 얻어오기
var router = express.Router();

// route 의 동작 정의하기
router.get('/test1', function(req, res) {
    res.end('/test1 response!');
});
router.get('/test2', function(req, res) {
    res.end('/test2 response!');
});

// 동작이 정의된 router 객체를 require() 한 곳으로 돌려주기
module.exports = router;
