
var fileToSend = "";

const file_element = document.getElementById('file-button');
file_element.addEventListener("change", function () {
    const reader = new FileReader();
    reader.onload = function() {
        fileToSend = reader.result;
        //console.log(fileToSend);
        Chunk(fileToSend);
        //Post();
    }
    reader.readAsBinaryString(file_element.files[0])
    //maybe read as text for the actual file?
});

function Chunk(fileBinString) {
    var chunkSize = 5000000;
    var startIdx = 0;
    var endIdx = chunkSize;
    var chunk = "";
    var numChunks = parseInt((fileBinString.length / chunkSize) + 1);
    console.log(numChunks);

    for (let i = 0; i < numChunks; i++) {
        chunk = fileBinString.substring(startIdx, endIdx);
        startIdx = endIdx;
        endIdx = endIdx + chunkSize;
        if (endIdx >= fileBinString.length) {
            endIdx = fileBinString.length;
        }

        chunk = i + "#" + chunk;
        console.log(chunk);
        Post(chunk);
    }
};

function Get() {
    'use strict';
    const request = new XMLHttpRequest();
    request.open('GET', 'getdata', true);
    request.send();

    request.onreadystatechange = function() {
        console.log(request.response);
    }
}

function Post(chunk) {
    'use strict';
    const request = new XMLHttpRequest();
    request.open('POST', 'postdata', true);
    request.send(chunk);

    request.onreadystatechange = function() {
        console.log(request.response);
    }
};