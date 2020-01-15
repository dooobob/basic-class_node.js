// 외부 모듈 설치는
// http://npmjs.com에서 검색 후
//
// npm install 모듈명
//
// 해서 설치 할 수 있습니다.

// 설치된 외부모듈의 참조값 얻어오기
var ejs = require("ejs");
var fs = require("fs");

fs.readFile("ejsTest.html", "utf-8", function(err, data) {
    var result = ejs.render(data, {
        name: "원숭이"
    });
    console.log(result);
});
