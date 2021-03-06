require('./models/db');

var express = require('express');
var app = express();
const path = require('path');

const userRoute = require('./controllers/userController')
// const userRoute = require('./controllers/userController')


app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

// const bodyParser = require("body-parser");

// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());

app.use(express.static("public"));
app.set("view engine", 'ejs');
app.set("views", path.join(__dirname, "./views"));
// app.set("views", "./views");


var server = require('http').Server(app);
var io = require('socket.io')(server);
server.listen(process.env.PORT || 3001);

var arrUsers = [];
var arrUsersWriting = [];


app.use('/', userRoute);

// connectDB();

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
        const text = {user:socket.Username, content:data};
        // const text = socket.Username + " : " + data;
        
        socket.broadcast.emit("server-send-mess-forglobal" , text);        
        const text2 = data;
        // const text2 = "Tôi : " + data;
        socket.emit("server-send-mess-forme" , text2);
    })

    socket.on("client-send-writingevent", () => {
        if(arrUsersWriting.indexOf(socket.Username) < 0){
            arrUsersWriting.push(socket.Username);
            // {usersWriting: arrUsersWriting, user: socket.Username}
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
