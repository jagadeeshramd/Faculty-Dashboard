function updatemarks(){
    ul=document.getElementById("mark-list");
    console.log("updatemarks");
    var c = ul.childNodes;
    for(i=0;i<c.length;i++)
    {
        i1=c[i].childNodes;
        console.log("score"+i1[1].value);
    }

}