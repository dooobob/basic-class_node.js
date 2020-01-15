// http 모듈의 참조값을 얻어옵니다.
var http = require("http");
// 서버 객체를 만듭니다.
var server = http.createServer(function(req, res) {
    // res 는 응답 객체이므로 res 객체를 통해서 응답한다.

    //응답 헤더 정보
    res.writeHead(200, {
        "Content-Type": "text/html;charset=utf-8"
    });
    // html 문서
    var html = "<!doctype html>" +
        "<html>" +
        "<head>" +
        "<meta charset='utf-8'/>" +
        "<title>test.html</title>" +
        "</head>" +
        "<body>" +
        "<h3>김구라</h3>" +
        "</body>" +
        "</html>";
    //응답
    res.end(html);

});

//서버를 시작 시킵니다.
server.listen(3001, function() {
    console.log("Server is Running at 3000 port!");
});
