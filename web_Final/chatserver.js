var express = require("express");
var bodyParser = require("body-parser");
var app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: false}));

var msgs = {};        
var chatRooms = [];  

app.get("/createRoom", function(request, response) {
    var room = request.query.room;
    if (!chatRooms.includes(room)) {
        chatRooms.push(room);
        msgs[room] = [];
    }
    response.send("OK");
});

app.get("/rooms", function(request, response) {
    response.send(JSON.stringify(chatRooms));
});

app.get("/deleteRoom", function(request, response) {
    const room = request.query.room;

    const index = chatRooms.indexOf(room);
    if (index !== -1) {
        chatRooms.splice(index, 1); 
    }

    // msgs 객체에서 삭제
    if (msgs[room]) {
        delete msgs[room];
    }

    response.send("OK");
});

app.get("/input", function(request, response) {
    var msg = request.query.msg;
    var name = request.query.name;
    var room = request.query.room;
    var hour = request.query.hour;
    var min = request.query.min;

    if (msgs[room]) {
        msgs[room].push({
            name: name,
            msg: msg,
            hour: hour,
            min: min
        });
    }
    response.send("OK");
});

app.get("/get", function(request, response) {
    var num = Number(request.query.msg_num);
    var room = request.query.room;
    var sendMsg = [];

    if (msgs[room] && msgs[room].length > num) {
        sendMsg = msgs[room].slice(num);
    }

    response.send(JSON.stringify(sendMsg));// 객체로 보내기
});

app.listen(5555, function() {
    console.log("채팅 시작 >>> http://127.0.0.1:5555/chatclient.html");
});
