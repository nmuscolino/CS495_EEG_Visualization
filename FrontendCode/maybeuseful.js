function post() {
    if (fileToSend == "") {
        console.log("No file selected");
        return;
    }
    'use strict';
    console.log("in post");
    const csrftoken = Cookies.get('csrftoken');
    console.log(csrftoken)
    const request = new XMLHttpRequest();
    request.onload = () => {
        console.log(request.response);
    }

    request.open('POST', 'http://127.0.0.1:8000/eeg_visualization/getdata', true);
    request.setRequestHeader('X-CSRFToken', csrftoken);
    console.log(fileToSend);
    request.send(fileToSend);
}