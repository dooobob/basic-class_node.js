var express = require("express");
var router = express.Router();
// ObjectID 객체를 리턴해주는 함수를 얻어온다.
var ObjectID = require('mongoose').mongo.ObjectID;

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

    // 분산 파일 시스템에 출력 할 수 있는 스트림 객체 얻어오기
    var writeStream = global.gridFS.createWriteStream({
        filename: orgFileName,
        metadata: {
            writer: writer,
            title: title
        }
    });
    //업로드된 파일을 읽어들여서 출력 스트림에 연결한다.
    fs.createReadStream(savePath).pipe(writeStream);
    // 모두 출력했을때 실행할 함수 등록
    writeStream.on('close', function(file) {
        // upload 폴더의 파일 삭제하기
        fs.unlink(savePath, function() {});
        res.redirect('/board/list');
    });
});

//파일 목록 보기 요청 처리
router.get("/list", function(req, res) {
    global.gridFS.files.find().toArray(function(err, files) {
        if (err) throw err;
        console.log(files);
        res.render('board/list', {
            list: files
        });
        // res.end('ok!');
    });
});


// 파일 시스템에 접근하기 위한 모듈
var fs = require('fs');
var mime = require('mime');

// 파일 다운로드 요청 처리
router.get('/download', function(req, res) {
    // 다운로드 시켜줄 파일의 아이디를 읽어온다.
    var _id = req.query.id;
    global.gridFS.files
        .find({
            _id: ObjectID(_id)
        })
        .toArray(function(err, files) {
            // 파일 명 읽어오기
            var filename = files[0].filename;
            // 분산 파일 시스템에서 읽어들일 수 있는 스트림 객체 얻어오기
            var readStream = global.gridFS.createReadStream({
                _id: _id
            });
            // 응답 헤더 정보
            res.setHeader('Content-Disposition', 'attachment; filename=' + encodeURI(filename));
            res.setHeader('Content-Type', 'application/octet-stream');
            // res 객체를 이용해서 응답하기
            readStream.pipe(res);
        });
});

// 파일 삭제 요청처리
router.get('/delete', function(req, res) {
    var _id = req.query.id;
    global.gridFS.remove({
        _id: ObjectID(_id)
    }, function(err) {
        if (err) throw err;
        res.redirect('/board/list');
    })
});

module.exports = router;
