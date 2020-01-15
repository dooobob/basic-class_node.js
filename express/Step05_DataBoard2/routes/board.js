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
    var fileSize = fileObj.size; // 파일 사이즈
    // 업로드된 파일의 전체 경로
    var savePath = __dirname + '/../upload/' + saveFileName;
    // fs 모듈을 이용해서 파일을 읽어들인 다음 DB에 저장
    fs.open(savePath, 'r', function(err, fd) {
        // 파일 사이즈에 해당하는 Buffer 객체 생성
        var buffer = new Buffer(fileSize);
        fs.read(fd, buffer, 0, buffer.length, null, function(err, readedByte, buffer) {
            // 객체에 파일 정보를 담은 다음
            var obj = {
                writer: writer,
                title: title,
                filename: orgFileName,
                filesize: fileSize,
                file: buffer
            };
            // DB에 저장
            var newData = new Board(obj);
            newData.save(function(err) {
                if (err) throw err;
                // 파일 시스템에서 파일 삭제
                fs.unlink(savePath, function() {});
                // 파일 목록보기로 리다이렉트 이동
                res.redirect('/board/list');
            });
        });
    });
});

//파일 목록 보기 요청 처리
router.get("/list", function(req, res) {
    Board
        .find()
        .sort("_id")
        .select("_id writer title filename filesize regdate")
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
    }, 'filename file', function(err, data) {
        console.log(data);
        res.setHeader('Content-Disposition', 'attachment; filename=' + encodeURI(data.filename));
        res.setHeader('Content-Type', 'application/octet-stream');
        // res 객체를 이용해서 buffer 객체를 응답한다.
        res.end(data.file);
    });

})

// 파일 삭제 요청처리
router.get('/delete', function(req, res) {
    var _id = req.query.id;
    // DB에서 삭제
    Board.remove({
        _id: _id
    }, function(err) {
        if (err) throw err;
        res.redirect('/board/list');
    });
});

module.exports = router;
