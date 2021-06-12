function getstudentinfo(ele){
    var rno=ele.innerHTML;
    rno=rno.trim()
    var data={rollno:rno};
    console.log("Inside getstudentinfo"+rno);

    $.get('det_student_info',data,function(rdata,status){
        console.log(rdata);
        if(rdata['resp'])
        {
            disprecord(rdata['rec']);
        }
    });

    $.get('get_quiz_marks',data,function(rdata,status){
        console.log(rdata);
        if(rdata['resp'])
        {
            dispquiz(rdata['rec']);
        }
    });

    $.get('get_assignment_marks',data,function(rdata,status){
        console.log(rdata);
        if(rdata['resp'])
        {
            dispassignment(rdata['rec']);
        }
    });

    $.get('get_periodical_marks',data,function(rdata,status){
        console.log(rdata);
        if(rdata['resp'])
        {
            dispper(rdata['rec']);
        }
    });

    $.get('get_attendance',data,function(rdata,status){
        console.log(rdata);
        if(rdata['resp'])
        {
            dispatt(rdata['rec']);
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



function dispquiz(record){
    var ul=document.getElementById("quiz");
  
    while (ul.firstChild) {
        ul.removeChild(ul.firstChild);
      }
    var li = document.createElement("li");
    li.className = 'list-group-item active';
    li.setAttribute('id','quiz-title');
    li.textContent = "Quiz: ";
    ul.appendChild(li);
   
    for(var r in record){
        li = document.createElement("li");
        li.className = 'list-group-item';
        li.setAttribute('id','quiz-mark');
        li.textContent = "Quiz "+r+": "+record[r];
        ul.appendChild(li);
    }
}

function dispassignment(record){
    var ul=document.getElementById("assignment");

  
    while (ul.firstChild) {
        ul.removeChild(ul.firstChild);
      }

    var li = document.createElement("li");
    li.className = 'list-group-item active';
    li.setAttribute('id','assignment-title');
    li.textContent = "Assignment: ";
    ul.appendChild(li);

    for(var r in record){
        li = document.createElement("li");
        li.className = 'list-group-item';
        li.setAttribute('id','ass-mark');
        li.textContent = "Assignment "+r+": "+record[r];
        ul.appendChild(li);
    }
}

function dispper(record){
    var ul=document.getElementById("periodical");
    while (ul.firstChild) {
        ul.removeChild(ul.firstChild);
      }

    var li = document.createElement("li");
    li.className = 'list-group-item active';
    li.setAttribute('id','per-title');
    li.textContent = "Periodical: ";
    ul.appendChild(li);

  for(var r in record){
        li = document.createElement("li");
        li.className = 'list-group-item';
        li.setAttribute('id','per-mark');
        li.textContent = "Periodical "+r+": "+record[r];
        ul.appendChild(li);
    }
}

function dispatt(record){
    document.getElementById('attendance-val').innerHTML=record+"%";
    
}