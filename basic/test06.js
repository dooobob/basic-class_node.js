// http 모듈의 참조값을 얻어옵니다.
var http = require("http");
var fs = require("fs");
// 서버 객체를 만듭니다.
var server = http.createServer(function(req, res) {
    // res 는 응답 객체이므로 res 객체를 통해서 응답한다.

    // fs 묘듈을 이용해서 index.html 페이지를 읽어들인다.
    fs.readFile("index.html", "utf-8", function(err, data) {
        //응답 헤더 정보
        //응답 헤더 정보
        res.writeHead(200, {
            "Content-Type": "text/html;charset=utf-8"
        });
        // html 문서
        res.end(data);
    });
});

//서버를 시작 시킵니다.
server.listen(3001, function() {
    console.log("Server is Running at 3000 port!");
});
