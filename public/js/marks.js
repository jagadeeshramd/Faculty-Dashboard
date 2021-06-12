function updatemarks(){
    var ul=document.getElementById("mark-list");
    console.log("updatemarks");
    var c = ul.childNodes;
    for(var i of c)
    {
        var i1=i.childNodes;
        console.log("score"+i1[1].value);
    }

}