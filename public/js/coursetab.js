
function updatecoursetab(ele){
    var data={
        course:ele.innerHTML
    }
    $.get('updatecoursetab',data);
    var course_head=document.getElementById('course-selected');
    course_head.innerHTML=ele.innerHTML;
}