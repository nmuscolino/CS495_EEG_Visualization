import { genSpheres } from "./visualization.js";

var fileToSend = "";
var coordinates = "";

const file_element = document.getElementById('file-button');
file_element.addEventListener("change", function () {
    const reader = new FileReader();
    reader.onload = function() {
        fileToSend = reader.result;
        Chunk(fileToSend);
    }
    reader.readAsBinaryString(file_element.files[0])
});

const process_button = document.getElementById('process-button');
process_button.addEventListener('click', Get);

const visualize_button = document.getElementById('visualize-button');
visualize_button.addEventListener('click', Visualize);

function Visualize() {
    genSpheres(coordinates);
}

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
        //console.log(request.response);
        coordinates = request.response;
        //localStorage.setItem('coordinateData', JSON.stringify(request.response))
    }
};

function Post(chunk) {
    'use strict';
    const request = new XMLHttpRequest();
    request.open('POST', 'postdata', true);
    request.send(chunk);

    request.onreadystatechange = function() {
        console.log(request.response);
    }
};