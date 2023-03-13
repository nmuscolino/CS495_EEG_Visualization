import { RecoverFromUpload, UploadingCSS } from "./interactivity.js";
import {ChangeStatus, UpdateTable} from "./table.js";

let chunkCounter = 0;

export function UploadData() {
    UploadingCSS();
    UpdateTable();
    const fileSelector = document.querySelector('#file-input');
    const reader = new FileReader();
    reader.onload = function() {
        Compress(reader.result);
    }
    reader.readAsText(fileSelector.files[0])
};

function Compress(data) {
    var lines = data.split("\r\n");
    var size = parseInt(lines[0]);

    let x = new Float32Array(size);
    let y = new Float32Array(size);
    let z = new Float32Array(size);
    let r = new Uint8Array(size);
    let g = new Uint8Array(size);
    let b = new Uint8Array(size);

    x[0] = 'x'.charCodeAt(0);
    y[0] = 'y'.charCodeAt(0);
    z[0] = 'z'.charCodeAt(0);
    r[0] = 'r'.charCodeAt(0);
    g[0] = 'g'.charCodeAt(0);
    b[0] = 'b'.charCodeAt(0);

    for (let i = 1; i < lines.length; i++) {
        var values = lines[i].split(" ");

        x[i] = parseFloat(values[0])
        y[i] = parseFloat(values[1])
        z[i] = parseFloat(values[2])
        r[i] = parseInt(values[4]);
        g[i] = parseInt(values[5]);
        b[i] = parseInt(values[6]);
    }
    CallPosts(x, y, z, r, g, b);
};

function CallPosts(x, y, z, r, g, b) {
    Post(x, 'positions');
    Post(y, 'positions');
    Post(z, 'positions');
    Post(r, 'colors');
    Post(g, 'colors');
    Post(b, 'colors');
};

function Post(data, url) {
    'use strict';
    const postRequest = new XMLHttpRequest();
    postRequest.open('POST', url, true);
    postRequest.send(data);
    postRequest.onreadystatechange = function() {
        if (postRequest.readyState == 4 && postRequest.status == 200) {
            IncrementChunkCounter();
        }
    }
};

function IncrementChunkCounter() {
    chunkCounter = chunkCounter + 1;
    if (chunkCounter == 6) {
        ChangeStatus('Processing');
        ProcessDataOnBackend();
        chunkCounter = 0;
    }
};

//Get Request
function ProcessDataOnBackend() {
    ChangeStatus('Processing...');
    'use strict';
    const getRequest = new XMLHttpRequest();
    getRequest.open('GET', 'process', true);
    getRequest.send();
    getRequest.onreadystatechange = function() {
        if (getRequest.readyState == 4 && getRequest.status == 200) {
            var coordinates = getRequest.response;
            ChangeStatus('Ready');
            RecoverFromUpload();
            console.log("Coordinates Recieved.");
        }
    }
};