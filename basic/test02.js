// 파일 시스템 모듈의 참조값 얻어오기
var fs = require('fs');

// 파일 시스템 모듈을 이용해서 읽어들이기
var data = fs.readFileSync('memo.txt', 'utf-8');

// 콘솔에 출력
console.log(data);

console.log('test02.js 가 종료됩니다.');
