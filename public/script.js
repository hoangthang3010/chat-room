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
    const a = $('#listmess >div').last().attr('id-user')
    let html = ''
    if(a == data.user){
        $('.yourmess img').last().remove()
        html = `<div class="yourmess h-32 d-flex" id-user="${data.user}">
                <div class="avatar-in-mess mt-0">
                    <img src="https://dvdn247.net/wp-content/uploads/2020/07/avatar-mac-dinh-1.png"/>
                </div>
                <span class="content">${data.content}</span>
        </div>`
    }
    else{
        html = `<div class="yourmess" id-user="${data.user}">
            <div class="d-flex">
                <div class="h-18 w-30 mg-r-4"></div>
                <p class="name-in-mess mb-0">${data.user}</p>
            </div>
            <div class="d-flex">
                <div class="avatar-in-mess">
                    <img src="https://dvdn247.net/wp-content/uploads/2020/07/avatar-mac-dinh-1.png"/>
                </div>
                <span class="content">${data.content}</span>
            </div>
        </div>`
    };
    addMess(html);
})
 
socket.on("server-send-mess-forme" , (data) =>{
    // const html = `<div><p class="mymess">Tôi</p><p class="mymess">${data}</p><div>`;
    
    $('.mymess img').last().remove()
    const html = `<div class="mymess d-flex h-32">
            <span class="content">${data}</span>
            <div class="avatar-in-mess">
                <img src="https://iphonecugiare.com/wp-content/uploads/2020/03/89987601_811132979393833_6977336580381868032_n.jpg"/>
            </div>
        </div>`;
    addMess(html);

})

socket.on("server-send-listuserswriting" , (data) =>{
    if(data.length === 0){
        $(".writing").html("");
    }else{
        // $(".writing").html(data.join() + " đang viết");
        // data.join() + 
        // lastIndexOf
        $(".writing").html(`<div class="yourmess user-importing-text h-55">
                <div class="d-flex">
                    <div class="h-18 w-30 mg-r-4"></div>
                    <p class="name-in-mess mb-0">${data.join()} đang nhập</p>
                </div>
                <div class="d-flex align-items-center">
                    <div class="avatar-in-mess">
                        <img src="https://dvdn247.net/wp-content/uploads/2020/07/avatar-mac-dinh-1.png"/>
                    </div>
                    <div class="container-icon-importing d-flex align-items-center">
                        <img class="importing-text" src="/importing.gif"/>
                    </div>
                </div>
            </div>
        `);
    }
})


socket.on("server-send-listusers" , (data) =>{
    $("#box-content").html("");
    let html ="";
    data.map(user => html += `<div class="list-user d-flex align-items-center">
        <div class="avatar-in-mess">
            <img src="https://iphonecugiare.com/wp-content/uploads/2020/03/89987601_811132979393833_6977336580381868032_n.jpg"/>
        </div>
        <span>${user}</span>
    </div>` );

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

const scrollSmoothToBottom = (id) => {
    var div = document.getElementById(id);
    $('#' + id).animate({
        scrollTop: div.scrollHeight - div.clientHeight
    }, 500);
    console.log("div.scrollHeight:" + div.scrollHeight);
    console.log("div.clientHeight:" + div.clientHeight);

    // $('#' + id).stop().animate({
    //     scrollTop: $('#' + id)[0].scrollHeight
    //   }, 800);
 }

const addMess = (htmlAdded) =>{
    var html = $("#listmess").html();
    $("#listmess").html("");

    $("#listmess").append(html+ htmlAdded);
}

const sendMess = () =>{
    // console.log($(".mymess .content"));
    // const a = document.querySelectorAll('.yourmess .content')
    const mess = $("#txt_mess").val();
    if(mess){
        $("#txt_mess").val("");
        socket.emit("client-send-mess" , mess);
        scrollSmoothToBottom('listmess')
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