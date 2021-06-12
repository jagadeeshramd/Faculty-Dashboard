
var firebaseConfig = {
    apiKey: "AIzaSyBAaLEREKkojzCinpiQyiiplekNbkPeRrc",
    authDomain: "faculty-dashboard-75962.firebaseapp.com",
    projectId: "faculty-dashboard-75962",
    storageBucket: "faculty-dashboard-75962.appspot.com",
    messagingSenderId: "108331010859",
    appId: "1:108331010859:web:acab56a98167d87139936e",
    measurementId: "G-HMD6735S2Z"
};

firebase.initializeApp(firebaseConfig);


function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i of cookies) {
            const cookie = i.trim();

            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
const csrftoken = getCookie('csrftoken');
    
var selectedFile;
var filenum;
var filetype;
var foldername;
function getfile()
{
    document.getElementById("upload-status").innerHTML="";
    var f = document.getElementById("filebutton");
    selectedFile = f.files[0];
    foldername = '<%- coursecode -%>'+"/";
    filenum=document.getElementById("filename").value;

    if(filenum==1)
    {
        filetype="course_det";
    }
    else if(filenum==2){
        filetype="course_co";
    }
    else if(filenum==3){
        filetype="course_eval";
    }
    else if(filenum==4){
        filetype="course_syll";
    }
    console.log(foldername+"/"+filetype);
    uploadfile();
}
function uploadfile()
{
    var storageRef = firebase.storage().ref(foldername+ filetype);


    var uploadTask = storageRef.put(selectedFile);


    uploadTask.on('state_changed', function(snapshot){
      var progress = 
       (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        var uploader = document.getElementById('uploader');
        uploader.value=progress;
        switch (snapshot.state) {
          case firebase.storage.TaskState.PAUSED:
            console.log('Upload is paused');
            break;
          case firebase.storage.TaskState.RUNNING:
            console.log('Upload is running');
            break;
        }
    }, function(error) {console.log(error);
    }, function() {


         uploadTask.snapshot.ref.getDownloadURL().then(
          function(downloadURL) {


          console.log('File available at', downloadURL);

        // print the image url 
        data={
            'url':downloadURL,
            'filenum':filenum,
            csrfmiddlewaretoken: csrftoken
        };
            
        console.log(downloadURL);
        document.getElementById("upload-status").innerHTML="Uploaded Successfully";
        var uploader = document.getElementById('uploader');
        uploader.value=0;

        if(filenum==1)
        {
            document.getElementById("coursedetlink").href=downloadURL;
        }
        else if(filenum==2){
            document.getElementById("courseoutcometlink").href=downloadURL;
        }
        else if(filenum==3){
            document.getElementById("courseevallink").href=downloadURL;
        }
        else if(filenum==4){
            document.getElementById("coursesyllink").href=downloadURL;
        }
        $.post('/changeurl',data,function(data,status){
            
        });
        
      });
    });
}