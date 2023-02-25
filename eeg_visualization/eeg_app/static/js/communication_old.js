fileToSend = "";


const file_element = document.getElementById('file_element');
file_element.addEventListener("change", function () {
    const reader = new FileReader();
    reader.onload = function() {
        fileToSend = reader.result;
        console.log(fileToSend);
    }
    reader.readAsDataURL(file_element.files[0])
    //maybe read as text for the actual file?
});

function Post() {
    if (fileToSend == "") {
        console.log("No file selected");
        return;
    }
    'use strict';
    const request = new XMLHttpRequest();
    request.open('POST', 'postdata', true);
    request.send(fileToSend);

    request.onreadystatechange = function() {
        console.log(request.response);
    }
}