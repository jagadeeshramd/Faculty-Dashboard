exports.vcutoff=function cutoffvalid(marks){
    var f=0;
    for(var i=1;i<marks.length;i++)
    {
        var x=marks[i-1];
        
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
    return f;
};