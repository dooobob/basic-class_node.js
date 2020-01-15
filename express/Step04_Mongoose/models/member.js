var mongoose=require("mongoose");

//Schema 생성자 함수 얻어오기
var Schema=mongoose.Schema;

//회원정보를 저장할 스키마(Table 설계와 유사)
var memSchema=new Schema({
    num:Number,
    name:String,
    addr:String,
    regdate:{
        type:Date,
        default:Date.now,
        get:dateFormat
    }
});
//날짜 포맷 함수 
function dateFormat(val){
    if(!val)return val;
    //리턴할 문자열을 구성한다.
    var str=val.getFullYear()+"년 "+
    (val.getMonth()+1)+"월 "+
    val.getDate()+"일 "+
    val.getHours()+":"+
    val.getMinutes();
    return str;
}
//member.js 모듈을 require() 한 곳으로 돌려줄 값(객체, 생성자함수 )
module.exports=mongoose.model("Member", memSchema);