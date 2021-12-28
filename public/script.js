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
    else{
        d = ''
        k = 'h-32'
    }
    const html = `<div class="mymess ${k}"  time-send="${b.getTime()}">
            ${d}
            <div class="d-flex justify-content-end">
                <span class="content">${data}</span>
                <div class="avatar-in-mess">
                    <img src="https://iphonecugiare.com/wp-content/uploads/2020/03/89987601_811132979393833_6977336580381868032_n.jpg"/>
                </div>
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
//time
const parseMillisecondsIntoReadableTime = (milliseconds) => {
    //Get hours from milliseconds
    var hours = milliseconds / (1000*60*60);
    var absoluteHours = Math.floor(hours);
    var h = absoluteHours > 9 ? absoluteHours : '0' + absoluteHours;
  
    //Get remainder from hours and convert to minutes
    var minutes = (hours - absoluteHours) * 60;
    var absoluteMinutes = Math.floor(minutes);
    var m = absoluteMinutes > 9 ? absoluteMinutes : '0' +  absoluteMinutes;
  
    //Get remainder from minutes and convert to seconds
    var seconds = (minutes - absoluteMinutes) * 60;
    var absoluteSeconds = Math.floor(seconds);
    var s = absoluteSeconds > 9 ? absoluteSeconds : '0' + absoluteSeconds;
  
  
    return h + ':' + m + ':' + s;
}

const getYoutubeLikeToDisplay = (millisec) => {
    var seconds = (millisec / 1000).toFixed(0);
    var minutes = Math.floor(seconds / 60);
    var hours = "";
    if (minutes > 59) {
        hours = Math.floor(minutes / 60);
        hours = (hours >= 10) ? hours : "0" + hours;
        minutes = minutes - (hours * 60);
        minutes = (minutes >= 10) ? minutes : "0" + minutes;
    }

    seconds = Math.floor(seconds % 60);
    seconds = (seconds >= 10) ? seconds : "0" + seconds;
    if (hours != "") {
        return hours + ":" + minutes + ":" + seconds;
    }
    return minutes + ":" + seconds;
}
  
// const scrollSmoothToBottom = (id) => {
    // var div = document.getElementById(id);
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
        // scrollSmoothToBottom('listmess')
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