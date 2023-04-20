import { RecoverFromUpload, UploadingCSS } from "./interactivity.js";
import {ChangeStatus, UpdateTable} from "./table.js";
import { PLYLoader } from "../../ThreeJS/PLYLoader.js";
import { StatusMessage } from "./interactivity.js";

let chunkCounter = 0;

function DuplicateExists(newScanName) {
    const table = document.querySelector('#data-table');
    for (var i = 0; i < table.children.length; i++) {
        let curName = table.children[i].children[0].textContent;
        if (curName == newScanName) return true;
    }
    return false;
}

export function UploadData() {
    const file = document.querySelector('#file-input').files[0];
    
    const scanName = document.querySelector('#name-of-file').value;

    if (file === undefined) {
        StatusMessage("Error: Select a file.", "red");
        return;
    }
    else if (scanName === '') {
        StatusMessage("Error: Name the scan.", "red");
        return;
    }
    else if (DuplicateExists(scanName)) {
        StatusMessage("Error: Duplicate name. Rename the scan.", "red");
        return;
    }

    const fileType = file.name.split('.').pop();

    UploadingCSS();
    UpdateTable();

    const reader = new FileReader();
    reader.onload = function() {
        switch (fileType) {
            case "ply":
                CompressPly(reader.result);
            break;
            case "json":
                PostJSON(reader.result, 'postjsondata');
            break;
            case "pts":
                CompressPts(reader.result);
            break;
        }
    }
    
    switch (fileType) {
        case "ply":
            reader.readAsArrayBuffer(file);
        break;
        case "json":
        case "pts":
            reader.readAsText(file);
        break;
    }
};

function PostJSON(data, url) {
    //get the scan name, this could maybe go in a better place
    const scanName = document.querySelector('#name-of-file');

    let dataToSend = scanName.value + "!" + data

    'use strict';
    const postRequest = new XMLHttpRequest();
    postRequest.open('POST', url, true);
    postRequest.send(dataToSend);
    ChangeStatus('Ready');
    RecoverFromUpload();
}

function CompressPts(data) {
    var lines = data.split("\r\n");
    var size = parseInt(lines[0])+1;

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

        x[i] = parseFloat(values[0]);
        y[i] = parseFloat(values[1]);
        z[i] = parseFloat(values[2]);
        r[i] = parseInt(values[4]);
        g[i] = parseInt(values[5]);
        b[i] = parseInt(values[6]);
    }

    CallPosts(x, y, z, r, g, b);
};

function CompressPly(data) {
    let loader = new PLYLoader();
    let geometry = loader.parse(data);

    let positions = geometry.attributes.position;
    let colors = geometry.attributes.color;
    let size = positions.count+1;

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

    for (var i = 1; i < size; i++) {
        x[i] = positions.getX(i-1);
        y[i] = positions.getY(i-1);
        z[i] = positions.getZ(i-1);
        r[i] = colors.getX(i-1)*255;
        g[i] = colors.getY(i-1)*255;
        b[i] = colors.getZ(i-1)*255;
    }

    CallPosts(x, y, z, r, g, b);
}

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
        ChangeStatus('Processing...');
        StatusMessage('Status: Processing... (Please do not refresh or close the page)', 'green');
        ProcessDataOnBackend();
        chunkCounter = 0;
    }
};

//Get Request
function ProcessDataOnBackend() {
        'use strict';
        const postRequest = new XMLHttpRequest();
        postRequest.open('POST', 'process', true);
        const scanName = document.querySelector('#name-of-file');
        postRequest.send(scanName.value);
        postRequest.onreadystatechange = function() {
            if (postRequest.readyState == 4 && postRequest.status == 200) {
                    ChangeStatus('Ready');
                    RecoverFromUpload();
            }
            else if (postRequest.status >= 500) {
                StatusMessage('Error: Error occurred while processing data. Please refresh the page and try again.', 'red');
            }
        }
};
