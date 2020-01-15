var http = require("http");
var fs = require("fs");

var server = http.createServer(function(req, res) {
    fs.readFile("client.html", function(err, data) {
        res.writeHead(200, {
            "Content-Type": "text/html;charset=utf-8"
        });
        //읽은 웹페이지의 내용 출력하기
        res.end(data);
    });
});

server.listen(3000, function() {
    console.log("Server is running at 3000 port!");
});

// 실시간 데이터 전송을 하기 위한  socket.io 모듈
var socketIO = require('socket.io');

// 웹소켓 통신을 할수 있는 io 객체 얻어오기
var io = socketIO.listen(server);

// 클라이언트가 웹소켓 접속을 해오면 실행되는 함수 등록
io.sockets.on('connection', function(socket) {
    console.log('클라이언트가 웹소켓 접속을 했습니다.');
    console.log('접속한 소켓 아이디: ' + socket.id);
    // 클라이언트가 발생시키는 이벤트 처리
    socket.on('sendMessage', function(data) {
        console.log(data);
        // 클라이언트에게 이벤트 발생 시키면서 전달하기
        // socket.emit('getMessage', data);
        // 웹소켓 접속된 모든 클라이언트들에게 전달
        io.sockets.emit('getMessage', data);
    });
});
