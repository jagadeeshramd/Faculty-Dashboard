let x=0;

function changedisp(){
    
    console.log("Change display");
        if((document.getElementById("caupdateform").style.display=="none") || (document.getElementById("caupdateform").style.display=="hidden"))
        {
            $('#caupdateform').show();
            x=1;
        }
        else{

            $('#caupdateform').hide();
            x=0;
        }
    
}