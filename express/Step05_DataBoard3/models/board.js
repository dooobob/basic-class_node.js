var mongoose = require("mongoose");

//Schema 생성자 함수 얻어오기
var Schema = mongoose.Schema;

//파일정보를 저장할 스키마(Table 설계와 유사)
var boardSchema = new Schema({
    writer: String,
    title: String,
    filename: String,
    filesize: Number,
    file: Buffer, // 2진 데이터를 저장하기 위한 Type
    regdate: {
        type: Date,
        default: Date.now,
        get: dateFormat
    }
});
//날짜 포맷 함수
function dateFormat(val) {
    if (!val) return val;
    //리턴할 문자열을 구성한다.
    var str = val.getFullYear() + "년 " +
        (val.getMonth() + 1) + "월 " +
        val.getDate() + "일 " +
        val.getHours() + ":" +
        val.getMinutes();
    return str;
}
//board.js 모듈을 require() 한 곳으로 돌려줄 값(객체, 생성자함수 )
module.exports = mongoose.model("Board2", boardSchema);
