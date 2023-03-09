let x, y, z, l, r, g, b;
let chunkCounter = 0;

const fileSelector = document.querySelector('#file-input');

const fileSelectButton = document.querySelector("#file-select-button");

const fileNameLabel = document.querySelector("#file-name-label");
fileNameLabel.textContent = '';


const uploadButton = document.querySelector('#upload-button');
uploadButton.addEventListener('click', function() {
    console.log(x[0]);
    console.log(x[1]);
    console.log(x[2]);
    Post(x, 'positions');
    Post(y, 'positions');
    Post(z, 'positions');
    Post(l, 'colors');
    Post(r, 'colors');
    Post(g, 'colors');
    Post(b, 'colors');
    uploadButton.disabled = true;
    fileNameLabel.textContent = '';
});

fileSelectButton.addEventListener('click', function() {
    fileSelector.click();
});

fileSelector.addEventListener('change', function() {
    uploadButton.disabled = true;
    uploadButton.style.backgroundColor = "gray";
    fileNameLabel.textContent = fileSelector.files[0].name;
    const reader = new FileReader();
    reader.onload = function() {
        Compress(reader.result);
        uploadButton.disabled = false;
        uploadButton.style.backgroundColor = "purple";
    }
    reader.readAsText(fileSelector.files[0])
});


function Compress(data) {
    var lines = data.split("\r\n");
    var size = parseInt(lines[0]);

    x = new Float32Array(size);
    y = new Float32Array(size);
    z = new Float32Array(size);
    l = new Uint8Array(size);
    r = new Uint8Array(size);
    g = new Uint8Array(size);
    b = new Uint8Array(size);

    x[0] = 120.0; //ascii for x
    y[0] = 121.0; //ascii for y
    z[0] = 122.0; //ascii for z
    l[0] = 108; //ascii for l
    r[0] = 114; //ascii for r
    g[0] = 103; //ascii for g
    b[0] = 98; //ascii for b

    console.log(x[0]);
    console.log(y[0]);

    for (let i = 1; i < lines.length; i++) {
        var values = lines[i].split(" ");
        for (let j = 0; j < values.length; j++) {
            switch(j) {
                case 0:
                    x[i] = parseFloat(values[j]);
                    break;
                case 1:
                    y[i] = parseFloat(values[j]);
                    break;
                case 2:
                    z[i] = parseFloat(values[j]);
                     break;
                case 3:
                    l[i] = parseInt(values[j]);
                    break;
                case 4:
                    r[i] = parseInt(values[j]);
                    break;
                case 5:
                    g[i] = parseInt(values[j]);
                    break;
                case 6:
                    b[i] = parseInt(values[j]);
                    break;
            }
        }
    }
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

function Get(url) {
    'use strict';
    const getRequest = new XMLHttpRequest();
    getRequest.open('GET', 'process', true);
    getRequest.send();

    getRequest.onreadystatechange = function() {
        if (getRequest.readyState == 4 && getRequest.status == 200) {
            var coordinates = getRequest.response;
            console.log(coordinates);
        }
    }
};

function IncrementChunkCounter() {
    chunkCounter = chunkCounter + 1;
    if (chunkCounter == 7) {
        Get('process');
    }
}