fileToSend = "";




function Post() {
    if (fileToSend == "") {
        console.log("No file selected");
        return;
    }
    'use strict';
    const request = new XMLHttpRequest();
    request.open('POST', 'http://127.0.0.1:8000/eeg_visualization/getdata', true);
    request.send(fileToSend);
}