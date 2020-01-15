var express=require("express");
var router=express.Router();
var Member=require("../models/member");

//회원정보 추가 요청 처리
router.post("/insert", function(req, res){
    var num=req.body.num;
    var name=req.body.name;
    var addr=req.body.addr;
    //저장할 정보를 Member Type 객체에 담고 
    var mem=new Member({
        "num":num,
        "name":name,
        "addr":addr
    });
    //저장하기 
    mem.save(function(err){
        if(err){
            res.end("error!");
        }else{
            res.end("ok!");
        }
    });
});
//회원 목록보기 요청처리
router.get("/list", function(req,res){
    Member.find()
    .select("num name addr _id regdate")
    .exec(function(err, data){
        if(err){
            res.end("fail!");
        }else{
            res.render("member/list",{members:data});
        }
    });
});

router.get("/delete", function(req, res){
    //삭제할 회원의 _id 값 읽어오기 
    var _id=req.query.id;
    //DB 에서 삭제한다.
    Member.remove({"_id":_id},function(err){
        res.redirect("/member/list");
    });
});

router.get("/updateform", function(req, res){
    var _id=req.query.id;
    Member.findOne({"_id":_id},function(err, data){
        //data => { }
        res.render("member/updateform",{member:data});
    });
});

router.post("/update", function(req, res){
    var _id=req.body.id;
    var num=req.body.num;
    var name=req.body.name;
    var addr=req.body.addr;
    //저장할 정보를 {} 에 담는다. 
    var obj={num:num,name:name,addr:addr};
    Member.update({_id:_id},obj,function(err, count){
        console.log(count+" 개 수정");
        res.redirect("/member/list");
    });
});


module.exports=router;