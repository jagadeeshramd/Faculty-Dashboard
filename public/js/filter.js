
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i of cookies) {
            const cookie = i.trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function changefilter(x){
    if(x.value==0 || x.value==1)
    {
        $('#lower-bound-grp').show();
        $('#upper-bound-grp').hide();
    }
    else if(x.value==2 || x.value==3)
    {
        $('#lower-bound-grp').hide();
        $('#upper-bound-grp').show();
    }
    else if(x.value >= 4 && x.value <= 7 )
    {
        $('#lower-bound-grp').show();
        $('#upper-bound-grp').show();
    }
}

function applyfilter(){
    var o=document.getElementById("filter-type").value;
    var x=document.getElementById("lower-bound").value;
    var y=document.getElementById("upper-bound").value;
    var val={};
    if(o==0)
    {
        document.getElementById("fil-type-disp").innerHTML="MARKS >= x";
        val={
            option: o,
            lb:x
        };
    }
    else if(o==1)
    {
        document.getElementById("fil-type-disp").innerHTML="MARKS > x";
        val={
            option: o,
            lb:x
        };
    }
    else if(o==2)
    {
        document.getElementById("fil-type-disp").innerHTML="MARKS <= y";
        val={
            option: o,
            ub:y
        };
    }
    else if(o==3)
    {
        document.getElementById("fil-type-disp").innerHTML="MARKS < y";
        val={
            option: o,
            ub:y
        };
    }
    else if(o==4)
    {
        document.getElementById("fil-type-disp").innerHTML="x <= MARKS <= y";
        val={
            option: o,
            lb:x,
            ub:y
        };
    }
    else if(o==5)
    {
        document.getElementById("fil-type-disp").innerHTML="x <= MARKS < y";
        val={
            option: o,
            lb:x,
            ub:y
        };
    }
    else if(o==6)
    {
        document.getElementById("fil-type-disp").innerHTML="x < MARKS <= y";
        val={
            option: o,
            lb:x,
            ub:y
        };
    }
    else if(o==7)
    {
        document.getElementById("fil-type-disp").innerHTML="x < MARKS < y";
        val={
            option: o,
            lb:x,
            ub:y
        };
    }
    $.get('filter_data',val,function(rdata,status){
        if(rdata['comp']){
            document.getElementById("maxm").innerHTML=rdata['maxmark'];
            document.getElementById("minm").innerHTML=rdata['minmark'];
            document.getElementById("avgm").innerHTML=rdata['avgmark'];
            document.getElementById("totalstud").innerHTML=rdata['totalstud'];
            changegraph(rdata['marks']);
        }
    });
}

function nofilter(){
    var data={
        option:8
    };
    $.get('filter_data',data,function(data_r,status){
        if(data_r['comp']){
            document.getElementById("maxm").innerHTML=data_r['maxmark'];
            document.getElementById("minm").innerHTML=data_r['minmark'];
            document.getElementById("avgm").innerHTML=data_r['avgmark'];
            document.getElementById("totalstud").innerHTML=data_r['totalstud'];
            changegraph(data_r['marks']);
        }
    });
}   

function changegraph(obj){
    var myChart;
    document.getElementById("graph-status").style.display="none";
    if(myChart)
    {
        myChart.destroy();
    }
}

function updatecutoff(){
    var marks=[];
    var o=document.getElementById("O").value;
    marks.push(o);
    var a1=document.getElementById("A+").value;
    marks.push(a1);
    var a=document.getElementById("A").value;
    marks.push(a);
    var b1=document.getElementById("B+").value;
    marks.push(b1);
    var b=document.getElementById("B").value;
    marks.push(b);
    var c=document.getElementById("C").value;
    marks.push(c);
    var p=document.getElementById("P").value;
    marks.push(p);

    var f=0;
    for(var i=1;i<marks.length;i++)
    {
        var x=marks[i-1];
        
        if((x==0 && x<marks[i]) || x<=marks[i]) {
            f=1;
            break;
        }
    }
    

    if(f==1)
    {
        document.getElementById("err-content").innerHTML="Overlapping Cutoff Values. Error!!!";
        $('#errormodal').modal('show');
    }

    else{
        document.getElementById("err-content").innerHTML="Sucessfully Updated!!!";
        const csrftoken = getCookie('csrftoken');
    var data={
        mark: marks,
        csrfmiddlewaretoken: csrftoken
    };
    $.post('changecutoff',data,function(rdata,status){
        
        if(status.localeCompare("success")==0 && rdata['res']){
            document.getElementById("err-content").innerHTML="Sucessfully Updated!!!";
        } else if (status.localeCompare("success")==0){
            document.getElementById("err-content").innerHTML="Overlapping Cutoff Values. Error!!!";
        } else{
            document.getElementById("err-content").innerHTML="Overlapping Cutoff Values. Error!!!";
        }
        $('#errormodal').modal('show');
    });
    }
    
    
}