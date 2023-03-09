let x, y, z, l, r, g, b;

const fileSelector = document.querySelector('#file-input');

const fileSelectButton = document.querySelector("#file-select-button");

const fileNameLabel = document.querySelector("#file-name-label");
fileNameLabel.textContent = '';


const uploadButton = document.querySelector('#upload-button');
uploadButton.addEventListener('click', function() {
    Post(x);
    Post(y);
    Post(z);
    Post(l);
    Post(r);
    Post(g);
    Post(b);
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

    for (let i = 1; i < lines.length; i++) {
        var values = lines[i].split(" ");
        for (let j = 0; j < values.length; j++) {
            switch(j) {
                case 0:
                    x[i-1] = parseFloat(values[j]);
                    break;
                case 1:
                    y[i-1] = parseFloat(values[j]);
                    break;
                case 2:
                    z[i-1] = parseFloat(values[j]);
                     break;
                case 3:
                    l[i-1] = parseInt(values[j]);
                    break;
                case 4:
                    r[i-1] = parseInt(values[j]);
                    break;
                case 5:
                    g[i-1] = parseInt(values[j]);
                    break;
                case 6:
                    b[i-1] = parseInt(values[j]);
                    break;
            }
        }
    }
};

function Post(data) {
    'use strict';
    const postRequest = new XMLHttpRequest();
    postRequest.open('POST', 'postdata', true);
    postRequest.send(data);
};