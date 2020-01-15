var express = require("express");
var router = express.Router();

var Board = require("../models/board");

// 파일 업로드 폼 요청 처리
router.get("/insertform", function(req, res) {
    // views/board/insertform.ejs 를 출력
    res.render('board/insertform');
});

//파일 업로드 요청 처리
router.post("/insert", function(req, res) {
    //폼 전송된 파라미터 읽어오기
    var writer = req.body.writer;
    var title = req.body.title;
    //업로드된 파일의 정보를 가지고 있는 객체
    var fileObj = req.files.myFile;
    console.log(fileObj);

    var orgFileName = fileObj.originalname; //원본파일명
    var saveFileName = fileObj.name; //저장된 파일명

    var fileData = new Board({
        writer: writer,
        title: title,
        orgFileName: orgFileName,
        saveFileName: saveFileName
    });
    //업로드된 파일 정보를 저장하고
    fileData.save(function(err) {
        if (err) throw err;
        //파일 목록보기로 리다일렉트 응답한다.
        res.redirect("/board/list");
    });
});

//파일 목록 보기 요청 처리
router.get("/list", function(req, res) {
    Board
        .find()
        .sort("_id")
        .select("_id writer title orgFileName regdate")
        .exec(function(err, data) {
            if (err) throw err;
            // views/board/list.ejs 페이지에서 파일 목록을 출력해준다
            if (err) {
                console.log('===== ERR')
                console.log(err);
            }
            console.log(data);
            res.render("board/list", {
                list: data
            });
        });
});


// 파일 시스템에 접근하기 위한 모듈
var fs = require('fs');
var mime = require('mime');

// 파일 다운로드 요청 처리
router.get('/download', function(req, res) {
    // 다운로드 시켜줄 파일의 아이디를 읽어온다.
    var _id = req.query.id;
    // DB에서 다운로드 시켜줄 파일의 정보를 덛어온다.
    Board.findOne({
        _id: _id
    }, 'orgFileName saveFileName', function(err, data) {
        console.log(data);
        // 다운로드 할 파일의 경로
        var filePath = __dirname + '/../upload/' + data.saveFileName;
        // 원본 파일명
        var fileName = data.orgFileName;
        // 파일의 mimeType 을 읽어온다.
        var mimeType = mime.lookup(filePath);
        // 응답 헤더에 파일 명을 명시한다.
        res.setHeader('Content-Disposition', 'attachment; filename=' + encodeURI(fileName));
        // 응답 컨텐트 Type 설정
        res.setHeader('Content-Type', mimeType);
        // 파일을 다운로드 시켜 줄 스트림 객체를 얻어온다.
        var fileStream = fs.createReadStream(filePath);
        // 응답 객체를 통해서 다운로드 시켜주기
        fileStream.pipe(res);
    });

})

// 파일 삭제 요청처리
router.get('/delete', function(req, res) {
    var _id = req.query.id;
    // 삭제할 파일의 저장된 파일명을 읽어온다
    Board.findOne({
        _id: _id
    }, 'saveFileName', function(err, data) {
        // 삭제할 파일의 경로구성
        var filePath = __dirname + '/../upload/' + data.saveFileName;
        // 파일 시스템에서 파일 삭제
        fs.unlink(filePath, function() {
            // DB에서 삭제
            Board.remove({
                _id: _id
            }, function(err) {
                if (err) throw err;
                res.redirect('/board/list');
            });
        });
    });
});

module.exports = router;
