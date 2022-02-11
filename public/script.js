const socket = io("https://chat-room-hoangthang3010.herokuapp.com/");

socket.on("server-send-reg-fail" , () =>{
    alert("The name has been given by someone else");
})

socket.on("server-send-reg-success" , (data) =>{
    $(".loginform").hide(2000);
    $(".chatform").show(1000);
    $(".chatform").css("display", "flex");


    $("#currentuser").html(data);
    // sendDataToClick(data)

})

socket.on("server-send-mess-forglobal" , (data) =>{
    const a = $('#listmess >div').last().attr('id-user')
    const b =  new Date()
    const c = $('#listmess >div').last().attr('time-send')
    // const c = $('.time-send').last().attr('time-send')
    let html = ''
    if(a == data.user && (b.getTime() - 120000 < c)){
        $('.yourmess img').last().remove()
        html = `<div class="yourmess h-32 d-flex" id-user="${data.user}" time-send="${b.getTime()}">
                <div class="avatar-in-mess mt-0">
                    <img src="https://dvdn247.net/wp-content/uploads/2020/07/avatar-mac-dinh-1.png"/>
                </div>
                <span class="content">${data.content}</span>
        </div>`
    }
    else{
        let d = ''
        let k = ''
        if(b.getTime() - 120000 > c || !c){
            d = `<div class="d-flex justify-content-center fs-12 time-send">${b.getHours()}:${b.getMinutes() < 10 ? '0'+b.getMinutes() : b.getMinutes()}</div>`
            k = 'h-68'
        }
        else if(b.getTime() - 60000 > c || !c){
            d = ''
            k = 'h-58 d-flex align-items-end'
        }
        else{
            d = ''
            k = 'h-50'
        }
        html = `<div class="yourmess ${k}" id-user="${data.user}" time-send="${b.getTime()}">
            ${d}
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
    setTimeout(() => {
        document.getElementById('listmess').scroll(0, document.getElementById('listmess').scrollHeight);
    }, 0);
    addMess(html);
})
 
socket.on("server-send-mess-forme" , (data) =>{
    // const html = `<div><p class="mymess">Tôi</p><p class="mymess">${data}</p><div>`;

    const b =  new Date()
    const c = $('#listmess >div').last().attr('time-send')
    $('.mymess img').last().remove()
    let d = ''
    let k = ''
    if(b.getTime() - 120000 > c || !c){
        d = `<div class="d-flex justify-content-center fs-12 time-send">${b.getHours()}:${b.getMinutes() < 10 ? '0'+b.getMinutes() : b.getMinutes()}</div>`
        k = 'h-50'
    }
    else if(b.getTime() - 60000 > c || !c){
        d = ''
        k = 'h-40 d-flex align-items-end'
    }
    else{
        d = ''
        k = 'h-32'
    }
    const html = `<div class="mymess ${k}"  time-send="${b.getTime()}">
            ${d}
            <div class="d-flex justify-content-end align-items-center">
                <span class="content">${data}</span>
                <div class="avatar-in-mess">
                    <img src="https://iphonecugiare.com/wp-content/uploads/2020/03/89987601_811132979393833_6977336580381868032_n.jpg"/>
                </div>
            </div>
        </div>`;
    // document.getElementById("TextBox1").focus()
    setTimeout(() => {
        document.getElementById('listmess').scroll(0, document.getElementById('listmess').scrollHeight);
    }, 0);

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
  
// const scrollSmoothToBottom = (id) => {
    // let div = document.getElementById(id);
    // $('#' + id).animate({
    //     scrollTop: div.scrollHeight - div.clientHeight
    // }, 500);
    // console.log("div.scrollHeight:" + div.scrollHeight);
    // console.log("div.clientHeight:" + div.clientHeight);

    // $('#' + id).stop().animate({
    //     scrollTop: $('#' + id)[0].scrollHeight
    //   }, 800);
//  }

const addMess = (htmlAdded) =>{
    let html = $("#listmess").html();
    $("#listmess").html("");

    $("#listmess").append(html+ htmlAdded);
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

// function sendDataToClick(valueId){
//     sendData = () =>{
//         console.log(valueId);
//     }
// }

    $(document).ready(() => {
        
        $("#btn_login").click(() =>{
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
            const idUser = $("#txt_username").val();
            const content = $("#txt_mess").val();
            console.log('sockettttt: ',socket);
            sendMess();
            
            $.post("http://localhost:3001/send",{idUser: idUser, content: content}, function(data){
                if(data === 'yes') {
                    alert("login success");
                }
            });
        })
        $("#txt_mess").keypress((e) =>{
            let key = e.which;
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
// }