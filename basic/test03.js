// 파일 시스템 모듈의 참조값 얻어오기
var fs = require('fs');

// 파일 시스템 모듈을 이용해서 읽어들이기
fs.readFile('memo.txt', 'utf-8', function(err, data) {
    console.log('비동기 방식으로 읽었습니다.');
    console.log(data);
});

console.log('test03.js 가 종료됩니다.');
