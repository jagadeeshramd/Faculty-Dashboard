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
        val={
            option: o,
            lb:x
        };
    }
    else if(o==1)
    {
        val={
            option: o,
            lb:x
        };
    }
    else if(o==2)
    {
        val={
            option: o,
            ub:y
        };
    }
    else if(o==3)
    {
        val={
            option: o,
            ub:y
        };
    }
    else if(o==4)
    {
        val={
            option: o,
            lb:x,
            ub:y
        };
    }
    else if(o==5)
    {
        val={
            option: o,
            lb:x,
            ub:y
        };
    }
    else if(o==6)
    {
        val={
            option: o,
            lb:x,
            ub:y
        };
    }
    else if(o==7)
    {
        val={
            option: o,
            lb:x,
            ub:y
        };
    }
    console.log(val);
}

