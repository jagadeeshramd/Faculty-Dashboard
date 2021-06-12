function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i of cookies) {
            const cookie = i.trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function rc_grade(){
    const csrftoken = getCookie('csrftoken');
    data={
        csrfmiddlewaretoken: csrftoken
    };
    $.post('re_calc_grade',data,function(rdata,status){
        console.log(status);
        console.log(rdata+" "+rdata['res']+" "+(rdata['res']));
        if(status.localeCompare("success")==0){
            if(rdata['res'])
            {
                document.getElementById("err-content").innerHTML="Sucessfully Updated. Reload!!!";
            }
            else{
                document.getElementById("err-content").innerHTML="Error!!!";
    
            }
        }
        else{
            document.getElementById("err-content").innerHTML="Error!!!";
        }
        $('#errormodal').modal('show');
    });
}