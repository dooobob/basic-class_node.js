// http 모듈의 참조값을 얻어옵니다.
var http = require("http");
var fs = require("fs");
var ejs = require("ejs");

// DB 에 저장된 회원 정보라고 가정하자
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

// 서버 객체를 만듭니다.
var server = http.createServer(function(req, res) {
    // res 는 응답 객체이므로 res 객체를 통해서 응답한다.

    console.log(req);

    // fs 모듕을 이용해서 ejsTest2.ejs 페이지를 읽어들인다.
    fs.readFile("ejsTest2.ejs", "utf8", function(err, data) {
        //응답 헤더 정보
        res.writeHead(200, {
            "Content-Type": "text/html;charset=utf-8"
        });
        //읽은 문자열을 ejs 모듈로 해석한 결과 얻어내기
        var result = ejs.render(data, {
            members: members
        });
        //ejs 모듈로 해석한 결과를 응답하기
        res.end(result);
    });

});

//서버를 시작 시킵니다.
server.listen(3001, function() {
    console.log("Server is Running at 3000 port!");
});
