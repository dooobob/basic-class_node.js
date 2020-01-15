// os 모듈의 참조값 얻어오기
var os = require('os'); // import + 객체 생성

// os  모듈 사용해보기
console.log(os.hostname());
console.log(os.platform());
console.log(os.totalmem());
console.log(os.freemem());


// url 모듈 사용해보기
var url = require('url');
var str = 'http://study.kimgura.net/member/test.jsp?q=10';
var obj = url.parse(str, true);
console.log(obj);

console.log('test01.js 가 종료 됩니다.');
