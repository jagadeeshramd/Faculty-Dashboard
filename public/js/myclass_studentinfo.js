function getInfo(ele){
    var rno=ele.innerHTML;
    rno=rno.trim()
    var data={rollno:rno};
    console.log("Inside getDetailInfo"+rno);

    $.get('det_student_detail_info',data,function(rdata,status){
        console.log(rdata);
        if(rdata['resp'])
        {
            disprecord(rdata['rec']);
        }
    });
    
}

function disprecord(record){
    document.getElementById('stud-rollno').innerHTML="Roll Number: "+record['roll_number'];
    document.getElementById('stud-enrolno').innerHTML = "Enrolment Number: " + record['enrolment_number'];
    document.getElementById('stud-name').innerHTML="Name: "+record['name'];
    document.getElementById('stud-gender').innerHTML="Gender: "+record['gender'];
    document.getElementById('stud-clg-id').innerHTML="College Email: "+record['college_mail_id'];
    document.getElementById('stud-per-id').innerHTML="Personal Email: "+record['personal_mail_id'];
    document.getElementById('stud-phno').innerHTML = "Phone Number: " + record['phone_number'];
    document.getElementById('stud-hostel').innerHTML="Hostel: "+record['hostel'];
    document.getElementById('stud-room').innerHTML = "Room: " + record['room_number'];
    document.getElementById('stud-nat').innerHTML = "Nationality: " + record['nationality'];
    document.getElementById('stud-mt').innerHTML = "Mother Tongue: " + record['mother_tongue'];
    document.getElementById('stud-commaddr').innerHTML = "Communication Address: " + record['communication_address'];
    document.getElementById('stud-peraddr').innerHTML = "Permanent Address: " + record['permanent_address'];
    document.getElementById('stud-dob').innerHTML = "Date of Birth: " + record['dob'];
    document.getElementById('stud-bloodgrp').innerHTML = "Blood Group: " + record['blood_group'];
    
    document.getElementById('parent-rel').innerHTML = "Relation: " + record['p_relation'];
    document.getElementById('parent-name').innerHTML = "Name: " + record['p_name'];
    document.getElementById('parent-phno').innerHTML = "Phone Number: " + record['p_phone_number'];
    document.getElementById('parent-id').innerHTML = "Email: " + record['p_email_id'];
    if(record['gender'].localeCompare("M")==0){
        document.getElementById('stud-img').src="/images/boy_avatar.png";
    }
    else{
        document.getElementById('stud-img').src="/images/girl_avatar.png";
    }
}
