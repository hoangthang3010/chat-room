var express = require('express');
var app = express();

app.use(express.static("public"));
app.set("view engine", 'ejs');
app.set("views", "./views");

var server = require('http').Server(app);
var io = require('socket.io')(server);
server.listen(process.env.PORT || 3000);

var arrUsers = [];
var arrUsersWriting = [];

io.on("connection", (socket) => {
    console.log("Co ng ket noi :" + socket.id);

    socket.on("client-send-username", (data) => {
        if(arrUsers.indexOf(data) >= 0){
            socket.emit("server-send-reg-fail");
        }else{
            socket.Username = data;
            arrUsers.push(data);
            socket.emit("server-send-reg-success" , data);
            io.sockets.emit("server-send-listusers" , arrUsers);
            socket.broadcast.emit("server-send-userlogin" , socket.Username);
        }
    })

    socket.on("client-send-logoutevent", () => {
        arrUsers.splice(
            arrUsers.indexOf(socket.Username) , 1
        );

        socket.broadcast.emit("server-send-listusers" , arrUsers);
        socket.broadcast.emit("server-send-userlogout" , socket.Username);
    })

    socket.on("client-send-mess", (data) => {
        const text = socket.Username + " : " + data;
        socket.broadcast.emit("server-send-mess-forglobal" , text);
        const text2 = "Tôi : " + data;
        socket.emit("server-send-mess-forme" , text2);
    })

    socket.on("client-send-writingevent", () => {
        if(arrUsersWriting.indexOf(socket.Username) < 0){
            arrUsersWriting.push(socket.Username);
            socket.broadcast.emit("server-send-listuserswriting" , arrUsersWriting);
        }
    })

    socket.on("client-send-stopwritingevent", () => {
        if(arrUsersWriting.indexOf(socket.Username) >= 0){
            arrUsersWriting.splice(
                arrUsersWriting.indexOf(socket.Username) , 1
            );
            
            socket.broadcast.emit("server-send-listuserswriting" , arrUsersWriting);
        }
    })

    socket.on('disconnect', function() {
        arrUsers.splice(
            arrUsers.indexOf(socket.Username) , 1
        );

        socket.broadcast.emit("server-send-listusers" , arrUsers);
        socket.broadcast.emit("server-send-userlogout" , socket.Username);
    });

})

app.get("/", (req, res) => {
    res.render("index");
})