
function updatecoursetab(ele){
    data={
        course:ele.innerHTML
    }
    $.get('updatecoursetab',data,function(rdata,status){
        console.log(rdata);
    });
    course_head=document.getElementById('course-selected');
    course_head.innerHTML=ele.innerHTML;
}