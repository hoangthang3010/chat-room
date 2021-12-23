const socket = io("http://localhost:3000/");

socket.on("server-send-reg-fail" , () =>{
    alert("The name has been given by someone else");
})

socket.on("server-send-reg-success" , (data) =>{
    $(".loginform").hide(2000);
    $(".chatform").show(1000);
    $(".chatform").css("display", "flex");


    $("#currentuser").html(data);

})

socket.on("server-send-mess-forglobal" , (data) =>{
    const html = `<div class="yourmess">
        <img class="avatar-in-mess" src="https://dvdn247.net/wp-content/uploads/2020/07/avatar-mac-dinh-1.png"/>
        <div>
            <p class="name-in-mess">${data.user}</p>
            <span class="content">${data.content}</span>
        </div>
    </div>`;
    addMess(html);
})
 
socket.on("server-send-mess-forme" , (data) =>{
    // const html = `<div><p class="mymess">Tôi</p><p class="mymess">${data}</p><div>`;
    const html = `<div class="mymess"><span class="content">${data}</span><img class="avatar-in-mess" src="https://iphonecugiare.com/wp-content/uploads/2020/03/89987601_811132979393833_6977336580381868032_n.jpg"/></div>`;
    addMess(html);

})

socket.on("server-send-listuserswriting" , (data) =>{
    if(data.length === 0){
        $(".writing").html("");
    }else{
        $(".writing").html(data.join() + `<img src="../src/image/importing.png"/>`);
    }

})


socket.on("server-send-listusers" , (data) =>{
    $("#box-content").html("");
    let html ="";
    data.map(user => html += `<div class="list-user" style="align-item: center"><img class="avatar-in-mess" src="https://iphonecugiare.com/wp-content/uploads/2020/03/89987601_811132979393833_6977336580381868032_n.jpg"/><span>${user}</span></div>` );

    $("#box-content").append(html);
})

socket.on("server-send-userlogin" , (data) =>{
    const html = `<p class="notification">${data} đã tham gia</p>`;

    addMess(html);
})

socket.on("server-send-userlogout" , (data) =>{
    const html = `<p class="notification">${data} đã thoát</p>`;

    addMess(html);
})

const addMess = (htmlAdded) =>{
    var html = $("#listmess").html();
    $("#listmess").html("");

    $("#listmess").append(html+ htmlAdded);
    console.log(html);
}

const sendMess = () =>{
    const mess = $("#txt_mess").val();
    if(mess){
        $("#txt_mess").val("");
        socket.emit("client-send-mess" , mess);
    }
    else{
        $("#txt_mess").focus();
    }
}

$(document).ready(() => {
    
    $("#btn_register").click(() =>{
        const name = $("#txt_username").val();

        if(name !== ""){
            $("#listmess").html("");
            socket.emit("client-send-username", name);
        } else {
            alert("Your name is empty");
        }
    });

    $("#btn_logout").click(() =>{
        $("#txt_username").val("");
        $(".loginform").show();
        $(".chatform").hide();
        $("#listmess").html("");

        socket.emit("client-send-logoutevent");
    })

    $("#btn_sendmess").click(() =>{
        sendMess();
    })
    
    $("#txt_mess").keypress((e) =>{
        var key = e.which;
        if(key == 13)  // the enter key code
            {
                sendMess();
            }
    })

    $("#txt_mess").focusin(() =>{
        socket.emit("client-send-writingevent");
    })

    $("#txt_mess").focusout((e) =>{
        socket.emit("client-send-stopwritingevent");
    })
})