
function updatecoursetab(ele){
    var data={
        course:ele.innerHTML
    }
    $.get('updatecoursetab',data,function(rdata,status){
       
    });
    var course_head=document.getElementById('course-selected');
    course_head.innerHTML=ele.innerHTML;
}