let x, y, z, l, r, g, b;
let chunkCounter = 0;
let dbData;

const table = document.querySelector('#data-table');

const fileSelector = document.querySelector('#file-input');

const fileSelectButton = document.querySelector("#file-select-button");

const fileNameLabel = document.querySelector("#file-name-label");
fileNameLabel.textContent = '';

const nameOfFile = document.querySelector('#name-of-file');
nameOfFile.addEventListener('keyup', RemoveCharacters);
nameOfFile.addEventListener('keydown', RemoveCharacters);

function UpdateTable() {
    let scanName = nameOfFile.value;
    const date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth();
    let day = date.getDate();
    let status = 'Uploading...';
    let dateString = month.toString() + "/" + day.toString() + "/" + year.toString();
    let rowData = [scanName, dateString, status];
    let tr = CreateRow(rowData);
    table.insertBefore(tr, table.children[1]);
};

const uploadButton = document.querySelector('#upload-button');
uploadButton.addEventListener('click', function() {
    UpdateTable();
    console.log(x[0]);
    console.log(x[1]);
    console.log(x[2]);
    Post(x, 'positions');
    Post(y, 'positions');
    Post(z, 'positions');
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
    r = new Uint8Array(size);
    g = new Uint8Array(size);
    b = new Uint8Array(size);

    x[0] = 'x'.charCodeAt(0);
    y[0] = 'y'.charCodeAt(0);
    z[0] = 'z'.charCodeAt(0);
    r[0] = 'r'.charCodeAt(0);
    g[0] = 'g'.charCodeAt(0);
    b[0] = 'b'.charCodeAt(0);

    console.log(x[0]);
    console.log(y[0]);

    for (let i = 1; i < lines.length; i++) {
        var values = lines[i].split(" ");

        x[i] = parseFloat(values[0])
        y[i] = parseFloat(values[1])
        z[i] = parseFloat(values[2])
        r[i] = parseInt(values[4]);
        g[i] = parseInt(values[5]);
        b[i] = parseInt(values[6]);
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
            table.children[1].children[2].textContent = 'Ready';
            console.log(coordinates);

        }
    }
};

function IncrementChunkCounter() {
    chunkCounter = chunkCounter + 1;
    if (chunkCounter == 6) {
        table.children[1].children[2].textContent = 'Processing...';
        Get('process');
    }
}

//New Code



function RemoveCharacters() {
    const regExp = new RegExp('[^0-9a-zA-Z_]')
    var res = nameOfFile.value.replace(regExp, '');
    nameOfFile.value = res;
};

function CreateRow(rowData) {
    let tr = document.createElement('tr');

    for (let i = 0; i < 3; i++) {
        let td = document.createElement('td');
        td.appendChild(document.createTextNode(rowData[i]));
        tr.appendChild(td);
    }
    return tr;
}

function CreateHeader(headerData) {
    let tr = document.createElement('tr');

    for (let i = 0; i < 3; i++) {
        let th = document.createElement('th');
        th.appendChild(document.createTextNode(headerData[i]));
        tr.appendChild(th);
    }
    return tr;
}

function CreateTable(table, data) {
    let headerData = ['Scan Name', 'Date Uploaded', 'Status'];
    table.appendChild(CreateHeader(headerData));

    for (let i = 0; i < Object.keys(data).length; i++) {
        let scanName = Object.keys(data)[i];
        let date = data[Object.keys(data)[i]][0];
        let status = data[Object.keys(data)[i]][1];
        let rowData = [scanName, date, status];
        table.appendChild(CreateRow(rowData));
    }
}

function GetRequestDbData() {
    'use strict';
    const getRequest = new XMLHttpRequest();
    getRequest.open('GET', 'getdbdata', true);
    getRequest.send();

    getRequest.onreadystatechange = function() {
        if (getRequest.readyState == 4 && getRequest.status == 200) {
            dbData = getRequest.response;
            CreateTable(table, JSON.parse(dbData));
        }
    }
}

GetRequestDbData();
