function rc_grade(){
    const csrftoken = getCookie('csrftoken');
    var data={
        csrfmiddlewaretoken: csrftoken
    };
    $.post('re_calc_grade',data,function(rdata,status){
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
        console.log(window.href.location);
    });
}