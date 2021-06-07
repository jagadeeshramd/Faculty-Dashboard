function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
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
    console.log(x.value);
    if(x.value==0)
    {
        $('#lower-bound-grp').show();
        $('#upper-bound-grp').hide();
    }
    else if(x.value==1)
    {
        $('#lower-bound-grp').show();
        $('#upper-bound-grp').hide();
    }
    else if(x.value==2)
    {
        $('#lower-bound-grp').hide();
        $('#upper-bound-grp').show();
    }
    else if(x.value==3)
    {
        $('#lower-bound-grp').hide();
        $('#upper-bound-grp').show();
    }
    else if(x.value==4)
    {
        $('#lower-bound-grp').show();
        $('#upper-bound-grp').show();
    }
    else if(x.value==5)
    {
        $('#lower-bound-grp').show();
        $('#upper-bound-grp').show();
    }
    else if(x.value==6)
    {
        $('#lower-bound-grp').show();
        $('#upper-bound-grp').show();
    }
    else if(x.value==7)
    {
        $('#lower-bound-grp').show();
        $('#upper-bound-grp').show();
    }
}

function applyfilter(){
    o=document.getElementById("filter-type").value;
    x=document.getElementById("lower-bound").value;
    y=document.getElementById("upper-bound").value;
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
    console.log(val);
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
    data={
        option:8
    };
    $.get('filter_data',data,function(rdata,status){
        if(rdata['comp']){
            document.getElementById("maxm").innerHTML=rdata['maxmark'];
            document.getElementById("minm").innerHTML=rdata['minmark'];
            document.getElementById("avgm").innerHTML=rdata['avgmark'];
            document.getElementById("totalstud").innerHTML=rdata['totalstud'];
            changegraph(rdata['marks']);
        }
    });
}   

function changegraph(obj){
    var myChart;
        var ctx = document.getElementById("visual-graph").getContext('2d');
        document.getElementById("graph-status").style.display="none";
        if(myChart)
        {
            myChart.destroy();
        }
        
        console.log(obj);
        marks=[];
        for(i=0;i<obj.length;i++)
        {
            marks.push(obj[i]['total']);
        }

        var dataValues = marks;
        var dataLabels = [];
        for(i=0;i<dataValues.length;i++)
        dataLabels.push('');
        var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: dataLabels,
            datasets: [{
            label: 'Students Marks',
            data: dataValues,
            backgroundColor: '#2a26ff',
            }]
        },
        options: {
            scales: {
            xAxes: [{
                display: false,
                barPercentage: 1.1
                
            }, {
                display: true,
                ticks: {
                    autoSkip: false,
                }
            }],
            yAxes: [{
                ticks: {
                beginAtZero:true
                }
            }]
            }
        }
        }); 
}

function updatecutoff(){
    marks=[];
    o=document.getElementById("O").value;
    marks.push(o);
    a1=document.getElementById("A+").value;
    marks.push(a1);
    a=document.getElementById("A").value;
    marks.push(a);
    b1=document.getElementById("B+").value;
    marks.push(b1);
    b=document.getElementById("B").value;
    marks.push(b);
    c=document.getElementById("C").value;
    marks.push(c);
    p=document.getElementById("P").value;
    marks.push(p);

    console.log("Cutoff"+marks);
    var f=0;
    for(i=1;i<marks.length;i++)
    {
        x=marks[i-1];
        
        if(x==0)
        {
            if(x<marks[i])
            {
                f=1;
                break;
            }
        }
        else{
            if(x<=marks[i])
            {
                f=1;
                break;
            }
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
    data={
        mark: marks,
        csrfmiddlewaretoken: csrftoken
    };
    $.post('changecutoff',data,function(rdata,status){
        console.log(status);
        console.log(rdata+" "+rdata['res']+" "+(rdata['res']==true));
        if(status.localeCompare("success")==0){
            if(rdata['res']==true)
            {
                document.getElementById("err-content").innerHTML="Sucessfully Updated!!!";
            }
            else{
                document.getElementById("err-content").innerHTML="Overlapping Cutoff Values. Error!!!";
    
            }
        }
        else{
            document.getElementById("err-content").innerHTML="Overlapping Cutoff Values. Error!!!";
        }
        $('#errormodal').modal('show');
    });
    }
    
    
}