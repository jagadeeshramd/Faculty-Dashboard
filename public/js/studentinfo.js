function getstudentinfo(ele){
    var rno=ele.innerHTML;
    data={rollno:rno};
    console.log(rno);
    $.get('det_student_info',data,function(rdata,status){
        console.log(rdata);
        if(rdata['resp'])
        {
            disprecord(rdata['rec']);
        }
    });
}

function disprecord(record){
    document.getElementById('stud-name').innerHTML="Name: "+record['name'];
    document.getElementById('stud-rollno').innerHTML="Roll Number: "+record['roll_number'];
    document.getElementById('stud-clg-id').innerHTML="College email id: "+record['college_mail_id'];
    document.getElementById('stud-per-id').innerHTML="Personal email id: "+record['personal_mail_id'];
    document.getElementById('stud-phno').innerHTML="Phone number: "+record['phone_number'];
    if(record['gender'].localeCompare("M")==0){
        document.getElementById('stud-img').src="/images/boy_avatar.png";
    }
    else{
        document.getElementById('stud-img').src="/images/girl_avatar.png";
    }
}