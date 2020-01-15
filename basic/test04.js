// http  모듈의 참조값을 얻어옵니다.
var http = require('http');

// 서버 객체를 만듭니다.
var server = http.createServer(function(req, res) {
    console.log('클라이언트가 요청을 했습니다.');
    res.end('ok');
});

// 서버를 시작 시킵니다.
server.listen(3001, function() {
    console.log('Server is Running at 3001 port!')
});
